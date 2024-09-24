import { Button, Card, Col, Form, Input, message, Row, Select } from "antd";
import { useEffect, useState } from "react";
import SalesFormModal from "./SalesFormmodal";
import ProductTable from "../Product/ProductTable";
import { getSellerAPI, getSellersAPI, registerSellerAPI, updateSellerAPI } from "../../api/seller";
import useProducts from "../../hooks/useProducts";
import EmptySalesTable from "./EmptySalesTable";
import useEditableTable from "../../hooks/useEditableTable";
import { registerSalesToShippingAPI } from "../../api/shipping";
import ShippingFormModal from "./ShippingFormmodal";
import { getSucursalsAPI } from "../../api/sucursal";
import { getSellerInfoAPI } from "../../api/financeFlux";
import { getSellerProductsById } from "../../helpers/salesHelpers";


export const Sales = () => {
    const [modalType, setModalType] = useState<'sales' | 'shipping' | null>(null);
    const [refreshKey, setRefreshKey] = useState(0)
    const [sellers, setSellers] = useState([])
    const [newSeller, setNewSeller] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSellerId, setSelectedSellerId] = useState<number | undefined>(undefined);
    const [selectedProducts, setSelectedProducts, handleValueChange] = useEditableTable([])
    const { data } = useProducts();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [sucursal, setSucursal] = useState([] as any[]);

    const updateTotalAmount = (amount: number) => {
        setTotalAmount(amount);
    };
    const showSalesModal = () => {
        setModalType('sales');
    };

    const showShippingModal = () => {
        setModalType('shipping');
    };

    const handleCancel = () => {
        setModalType(null);
    };

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        // Aquí se pueden procesar los datos, como enviarlos al backend
        setModalType(null);
        setSelectedProducts([]);
        setTotalAmount(0);
    };

    const handleSuccess = () => {
        setModalType(null);
        setRefreshKey(prevKey => prevKey + 1);
    };
    const createSeller = async () => {
        if (!newSeller) return
        setLoading(true)
        const response = await registerSellerAPI({ vendedor: newSeller })
        setLoading(false)
        if (response.status) {
            message.success('Vendedor creado con éxito')
            fetchSellers()
            setNewSeller('')
        } else {
            message.error('Error al crear vendedor')
        }
    }
    const fetchSellers = async () => {
        try {
            const response = await getSellersAPI();
            setSellers(response);
        } catch (error) {
            message.error('Error al obtener los vendedores');
        }

    };

    const fetchSucursal = async () => {
        try {
            console.log("Fetch Sucursal")
            const response = await getSucursalsAPI()
            setSucursal(response)
        } catch (error) {
            message.error('Error al obtener los vendedores');
        }
    }
    const fetchFinanceSellerInfo = async (sellerId: number) => {
        try {
            console.log("Fetch seller information from financeFlux")
            const response = await getSellerInfoAPI(sellerId)
            setSucursal(response)
            return response
        } catch (error) {
            message.error('Error al obtener los vendedores');
        }
    }

    useEffect(() => {
        console.log("Use Effect")
        fetchSellers();
        fetchSucursal();
    }, []);

    useEffect(() => {
        console.log(sellers, 'sellers')
    }, [sellers])

    const filteredProducts = selectedSellerId
        ? data.filter(product => product.id_vendedor === selectedSellerId)
        : data;

    const handleProductSelect = (product: any) => {
        // setEditableProducts((prevProducts: any) => {
        setSelectedProducts((prevProducts: any) => {
            const exists = prevProducts.find((p: any) => p.key === product.key);
            if (!exists) {
                return [...prevProducts, { ...product, cantidad: 1, precio_unitario: product.precio, utilidad: 1 }];
            }
            return prevProducts;
        });
    };
    const handleDeleteProduct = (key: any) => {
        setSelectedProducts((prevProducts: any) => {
            const updatedProducts = prevProducts.filter((product: any) => product.key !== key);
            return updatedProducts;
        });
    };

    const createSales = async (shipping: any, productsToAdd: any) => {
        productsToAdd.map((item: any) => {
            item.productos = item.key
            item.vendedor = item.id_vendedor
        })
        try {
            await registerSalesToShippingAPI({
                shippingId: shipping.id_pedido,
                sales: productsToAdd
            })
        } catch (error) {
            message.error('Error registrando ventas del pedido')
        }
    }
    const calculateSellerDebt = async (id_vendedor: number): Promise<number> => {
        try {
            const sellerDebtInfo: any = await fetchFinanceSellerInfo(id_vendedor);
            const deudaTotalFinance = sellerDebtInfo?.filter((deuda: any) => deuda.esDeuda)
                .reduce((acc: number, deuda: any) => acc + parseFloat(deuda.monto), 0) || 0;
            return deudaTotalFinance;
        } catch (error) {
            console.error('Error al calcular la deuda del vendedor:', error);
            return 0;
        }
    };

    const previousProductsDebt = async (sellerId: number) => {
        //TODO:Delete if it is not useful anymore
        const sellerProducts = await getSellerProductsById(sellerId);
        const ventasNoPagadasProductos = sellerProducts.filter((product: any) => product.deposito_realizado === false);
        const totalDeudaProductos = ventasNoPagadasProductos.reduce((acc: number, producto: any) => {
            return acc + (producto.cantidad * producto.precio_unitario);
        }, 0);
        // console.log("Productos sin depósito del vendedor:", ventasNoPagadasProductos);
        // console.log("Total de la deuda de productos no pagados:", totalDeudaProductos);

        return totalDeudaProductos;
    }

    const updateSellerDebt = async (selectedProducts: any, prepayment: number) => {
        try {
            const productsBySeller = selectedProducts.reduce((acc: any, producto: any) => {
                const { id_vendedor } = producto;
                if (!acc[id_vendedor]) {
                    acc[id_vendedor] = {
                        vendedor: sellers.find((seller: any) => seller.id_vendedor === id_vendedor) || id_vendedor,
                        productos: []
                    };
                }
                acc[id_vendedor].productos.push({
                    id_producto: producto.key, cantidad: producto.cantidad, precio_unitario: producto.precio_unitario
                });
                return acc;
            }, {});

            // const debtBySeller = Object.values(productsBySeller).map((product_seller: any) => ({
            //     id_vendedor: product_seller.vendedor.id_vendedor || product_seller.vendedor,
            //     deuda: product_seller.productos.reduce((acc: number, producto: any) =>
            //         acc + (producto.cantidad * producto.precio_unitario), product_seller.vendedor.deuda)
            // }))
            const debtBySeller = await Promise.all(Object.values(productsBySeller).map(async (product_seller: any) => {
                const id_vendedor = product_seller.vendedor.id_vendedor || product_seller.vendedor;
                // const sellerDebtFinanceFlux = await calculateSellerDebt(id_vendedor);
                // const sellerProductsDebt = await previousProductsDebt(id_vendedor);
                const sellerInfo = await getSellerAPI(id_vendedor);
                const sellerCurrentDoubt = sellerInfo.deuda;
                const deudaTotalProducts = product_seller.productos.reduce((acc: number, producto: any) =>
                    acc + (producto.cantidad * producto.precio_unitario), 0);
                console.log("deuda total", deudaTotalProducts, " la deuda vendedor", sellerCurrentDoubt, " pago previo ", prepayment)
                const deudaTotal = sellerCurrentDoubt + deudaTotalProducts - prepayment;
                console.log("la deuda essss ", deudaTotal)
                return {
                    id_vendedor,
                    deuda: deudaTotal
                };
            }));
            const debtsRes = await Promise.all(debtBySeller.map(async (vendedor: any) =>
                updateSellerAPI(vendedor.id_vendedor, { deuda: vendedor.deuda })
            ))
            debtsRes.map((debtRes: any,) => {
                if (!debtRes.success) message.error('Error al registrar una deuda')
            })
            message.success('Deudas registradas con éxito')
            console.log(debtsRes, 'sales res')
        } catch (error) {
            console.error("Error actualizando la deuda del vendedor:", error);
            message.error('Error al actualizar las deudas');
        }
    }


    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Carrito</h1>
                <div className="flex space-x-2">
                    <Button onClick={showSalesModal} type="primary">Realizar Venta</Button>
                    <Button onClick={showShippingModal} type="primary">Realizar Entrega</Button>
                </div>
            </div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card
                        title={
                            <div className="flex justify-between items-center">
                                <span>Inventario</span>
                                <Form.Item
                                    name="id_vendedor"
                                    label="Vendedor"
                                    rules={[{ required: true, message: 'Por favor seleccione un vendedor' }]}
                                >
                                    <Select
                                        placeholder="Selecciona un vendedor"
                                        dropdownRender={menu => (
                                            <>
                                                {menu}
                                                <div style={{ display: 'flex', padding: 8 }}>
                                                    <Input
                                                        style={{ flex: 1, minWidth: 200, marginRight: 8 }}
                                                        value={newSeller}
                                                        onChange={e => setNewSeller(e.target.value)}
                                                    />
                                                    <Button
                                                        type="link"
                                                        onClick={createSeller}
                                                        loading={loading}
                                                    >
                                                        Añadir vendedor
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        options={sellers.map((vendedor: any) => ({
                                            value: vendedor.id_vendedor,
                                            label: vendedor.nombre,
                                        }))}
                                        showSearch
                                        filterOption={(input, option: any) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ minWidth: 400 }}
                                        onChange={(value) => setSelectedSellerId(value)}

                                    />
                                </Form.Item>
                            </div>
                        }
                        bordered={false}
                    >
                        <ProductTable data={filteredProducts} onSelectProduct={handleProductSelect} key={refreshKey} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Ventas" bordered={false}>
                        <EmptySalesTable
                            products={selectedProducts}
                            onDeleteProduct={handleDeleteProduct}
                            handleValueChange={handleValueChange}
                            onUpdateTotalAmount={updateTotalAmount}
                            key={refreshKey} />
                    </Card>
                </Col>
            </Row>
            <SalesFormModal
                visible={modalType === 'sales'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
                selectedProducts={selectedProducts}
                handleSales={createSales}
                totalAmount={totalAmount}
                sucursals={sucursal}
                handleDebt={updateSellerDebt}
                clearSelectedProducts={() => setSelectedProducts([])}
            />
            <ShippingFormModal
                visible={modalType === 'shipping'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
                selectedProducts={selectedProducts}
                handleSales={createSales}
                totalAmount={totalAmount}
                sucursals={sucursal}
                handleDebt={updateSellerDebt}
                clearSelectedProducts={() => setSelectedProducts([])}
            />
        </div>
    );
};

export default Sales;
