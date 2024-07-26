import { Button, Card, Col, Form, Input, message, Row, Select } from "antd";
import { useEffect, useState } from "react";
import SalesTable from "./SalesTable";
import SalesFormModal from "./SalesFormmodal";
import ShippingFormModal from "./ShippingFormmodal";
import ProductTable from "../Product/ProductTable";
import { getSellersAPI, registerSellerAPI } from "../../api/seller";
import useProducts from "../../hooks/useProducts";
import EmptySalesTable from "./EmptySalesTable";


export const Sales = () => {
    const [modalType, setModalType] = useState<'sales' | 'shipping' | null>(null);
    const [refreshKey, setRefreshKey] = useState(0)
    const [sellers, setSellers] = useState([])
    const [newSeller, setNewSeller] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSellerId, setSelectedSellerId] = useState<number | undefined>(undefined);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const { data } = useProducts();

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
    useEffect(() => {
        fetchSellers();
    }, []);

    const filteredProducts = selectedSellerId
        ? data.filter(product => product.id_vendedor === selectedSellerId)
        : data;

    const handleProductSelect = (product: any) => {
        setSelectedProducts((prevProducts) => {
            const exists = prevProducts.find(p => p.key === product.key);
            console.log(product)
            if (!exists) {
                return [...prevProducts, product];
            }
            return prevProducts;
        });
    };
    const handleDeleteProduct = (key: any) => {
        setSelectedProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter(product => product.key !== key);
            return updatedProducts;
        });
    };

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
                        <EmptySalesTable products={selectedProducts} onDeleteProduct={handleDeleteProduct} key={refreshKey} />
                    </Card>
                </Col>
            </Row>
            <SalesFormModal
                visible={modalType === 'sales'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
                selectedProducts={selectedProducts}
            />
            <ShippingFormModal
                visible={modalType === 'shipping'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Sales;
