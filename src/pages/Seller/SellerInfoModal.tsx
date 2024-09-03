import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import CustomTable from "./components/SalesTable";
import { deleteSalesBySaleIdsAPI, getProductsBySellerIdAPI, updateProductsByShippingAPI, updateSale } from "../../api/sales";
import { getShipingByIdsAPI } from "../../api/shipping";
import StockSellerTable from "./components/StockSellerTable";
import { updateSellerAPI } from "../../api/seller";
import { getProductAndStockBySellerId } from "../../api/product";
import { getSucursalsAPI } from "../../api/sucursal";
import useEditableTable from "../../hooks/useEditableTable";
import PaymentProofTable from "./components/PaymentProofTable";
import { getPaymentProofsBySellerIdAPI } from "../../api/paymentProof";

const SellerInfoModal = ({ visible, onSuccess, onCancel, seller }: any) => {

    const [loading, setLoading] = useState(false);
    const [products, setProducts, handleValueChange] = useEditableTable([])
    const [originalProducts, setOriginalProducts] = useState<any[]>([]);
    const [productsAndStock, setProductsAndStock] = useState<any[]>([]);
    const [paymentProofs, setPaymentProofs] = useState<any[]>([]);
    const [totalAdelantoCliente, setTotalAdelantoCliente] = useState(0);
    const [totalNoPagadas, setTotalNoPagadas] = useState(0);
    const [totalHistorial, setTotalHistorial] = useState(0);
    const [deudaCalculada, setDeudaCalculada] = useState(0);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [deletedProducts, setDeletedProducts] = useState<any[]>([]);
    const [sucursalesLoaded, setSucursalesLoaded] = useState(false);

    const fetchSucursales = async () => {
        try {
            const response = await getSucursalsAPI();
            setSucursales(response);
            setSucursalesLoaded(true);
        } catch (error) {
            console.log('Error fetching sucursales:', error)
        }
    }
    console.log(paymentProofs)
    const fetchPaymentProofs = async (sellerId: number) => {
        try {
            const response = await getPaymentProofsBySellerIdAPI(sellerId);
            if (Array.isArray(response)) {
                setPaymentProofs(response);
            } else {
                console.error("Expected array but received:", response);
            }
        } catch (error) {
            console.error('Error fetching payment proofs:', error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            const response = await getProductsBySellerIdAPI(seller.key);
            const productos = Array.isArray(response) ? response : [];

            const pedidos = response.map((product: any) => product.id_pedido);
            const uniquePedidos = Array.from(new Set<number>(pedidos));
            console.log(productos)
            const shippingsResponse = await getShipingByIdsAPI(uniquePedidos);
            if (shippingsResponse.success) {
                const totalAdelanto = shippingsResponse.data.reduce((total: number, pedido: any) => {
                    return total + (pedido.adelanto_cliente || 0);
                }, 0);
                setTotalAdelantoCliente(totalAdelanto);
                const productosConTipo = productos.map((product: any) => {
                    const lugarEntrega = shippingsResponse.data.find((pedido: any) => pedido.id_pedido === product.id_pedido)?.lugar_entrega;
                    const esVenta = sucursales.some((sucursal) => sucursal.nombre.toLowerCase() === lugarEntrega.toLowerCase());
                    return {
                        ...product,
                        tipo: esVenta ? "Venta" : "Pedido",
                        key: `${product.id_producto}-${product.fecha_pedido}`,
                    };
                });
                setProducts(productosConTipo);
                setOriginalProducts(productosConTipo);
            } else {
                console.error('Error fetching shippings:', shippingsResponse);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const handleDeleteProduct = (key: any) => {
        setProducts((prevProducts: any) => {
            const updatedProducts = prevProducts.filter((product: any) => product.key !== key);
            const deletedProduct = prevProducts.find((product: any) => product.key === key);
            if (deletedProduct && deletedProduct.id_venta) {
                setDeletedProducts((prevDeleted: any) => [...prevDeleted,
                {
                    id_venta: deletedProduct.id_venta,
                    id_producto: deletedProduct.id_producto
                }
                ]);
            }
            return updatedProducts;
        });
    };
    const fetchProductsAndStock = async () => {
        try {
            const response = await getProductAndStockBySellerId(seller.key);
            // const productosConKey = response.map((product: any) => {
            //     const keys = product.producto_sucursal.map((sucursal: any) => {
            //         return `${product.id_producto}-${sucursal.id_ingreso}`;
            //     });
            //     return {
            //         ...product,
            //         key: keys.join(', '),
            //         producto_sucursal: product.producto_sucursal.map((sucursal: any, index: number) => ({
            //             ...sucursal,
            //             key: keys[index],
            //         })),
            //     };
            // });
            setProductsAndStock(response)
        } catch (error) {
            console.log('Error fetching products with stock:', error)
        }
    };
    const calcularDeuda = () => {
        const totalServicios = seller.alquiler + seller.exhibicion + seller.delivery;
        const adelantoServicio = seller.adelanto_servicio || 0;

        const startDate = dayjs(seller.fecha, "D/M/YYYY/");
        const finishDate = dayjs(seller.fecha_vigencia, "D/M/YYYY/");

        const mesesTranscurridos = finishDate.diff(startDate, 'month');

        const deuda = (totalServicios * mesesTranscurridos) - adelantoServicio;
        setDeudaCalculada(deuda);
    };

    useEffect(() => {
        if (seller.key) {
            fetchSucursales();
        }
    }, [seller]);

    useEffect(() => {
        if (sucursalesLoaded) {
            fetchProducts();
            fetchProductsAndStock();
            fetchPaymentProofs(seller.key);
            calcularDeuda();
        }
    }, [sucursalesLoaded]);

    const handleFinish = async (sellerInfo: any) => {
        setLoading(true)
        const resSeller = await updateSellerAPI(parseInt(seller.key), sellerInfo)
        if (!resSeller?.success) {
            message.error('Error al editar el vendedor');
            setLoading(false);
            return;
        }
        for (const product of products) {
            const originalProduct = originalProducts.find((p: any) => p.key === product.key);
            if (
                originalProduct &&
                (product.precio_unitario !== originalProduct.precio_unitario ||
                    product.cantidad !== originalProduct.cantidad)
            ) {
                const updateData = {
                    cantidad: product.cantidad,
                    precio_unitario: product.precio_unitario
                };
                await updateSale(updateData, product.id_venta);
            }
        }
        // Elimina productos
        if (deletedProducts.length > 0) {
            const productIds = deletedProducts.map(p => p.id_venta);
            await deleteSalesBySaleIdsAPI(productIds);
        }


        message.success('Vendedor editado con éxito')
        onSuccess()
        setLoading(false)
    }
    console.log(deletedProducts)
    const ventasNoPagadasProductos = products.filter((product: any) => product.deposito_realizado === false);
    return (
        <Modal
            title={`Información Vendedor: ${seller.nombre}`}
            open={visible}
            footer={null}
            width={800}
            onCancel={onCancel}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ background: '#007bff', color: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', width: '48%', margin: '4px' }}>
                    <h3>PAGO PENDIENTE</h3>
                    <h2>{`${seller.deuda}`}</h2>
                </div>
                <div style={{ background: '#1976d2', color: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', width: '48%', margin: '4px' }}>
                    <h3>Deuda no pagado</h3>
                    <h2>{`Bs. ${deudaCalculada}`}</h2>
                </div>
                <div style={{ background: '#1976d2', color: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', width: '48%', margin: '4px' }}>
                    <h3>Saldo Pendiente</h3>
                    <h2>{`Bs. ${seller.deudaInt - deudaCalculada}`}</h2>
                </div>
            </div>
            <Form onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="telefono"
                    label='Teléfono'
                    initialValue={seller.telefono}
                >
                    <InputNumber style={{ width: '25%' }} />
                </Form.Item>
                <Form.Item
                    name="fecha_vigencia"
                    label='Fecha final/máxima del servicio'
                >
                    <DatePicker
                        defaultValue={(dayjs(seller.fecha_vigencia, "D/M/YYYY/"))}
                        format="DD/MM/YYYY" />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="alquiler"
                            label="Alquiler"
                            initialValue={seller.alquiler}
                        >
                            <InputNumber className="w-full" prefix="Bs." min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="exhibicion"
                            label="Exhibición"
                            initialValue={seller.exhibicion}
                        >
                            <InputNumber className="w-full" prefix="Bs." min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="delivery"
                            label="Delivery"
                            initialValue={seller.delivery}
                        >
                            <InputNumber className="w-full" prefix="Bs." min={0} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="mail"
                    label='Mail'
                    initialValue={seller.mail}
                >
                    <Input style={{ width: '50%' }} />
                </Form.Item>
                <Form.Item
                    name="fecha"
                    label='Fecha'
                >
                    <DatePicker
                        defaultValue={(dayjs(seller.fecha, "D/M/YYYY/"))}
                        format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="carnet"
                    label='Carnet'
                    initialValue={seller.carnet}
                >
                    <InputNumber style={{ width: '25%' }} />
                </Form.Item>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Ventas no pagadas</h4>
                    <CustomTable
                        data={ventasNoPagadasProductos}
                        onUpdateTotalAmount={setTotalNoPagadas}
                        onDeleteProduct={handleDeleteProduct}
                        // onUpdateTotalAmount={}
                        handleValueChange={handleValueChange}
                        showClient={true}
                    />
                </div>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Historial de ventas</h4>
                    <CustomTable
                        data={products}
                        onUpdateTotalAmount={setTotalHistorial}
                        onDeleteProduct={handleDeleteProduct}
                        // onUpdateTotalAmount={}
                        handleValueChange={handleValueChange}
                        showClient={false}
                    />
                </div>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Historial de ingreso</h4>
                    <StockSellerTable
                        data={productsAndStock}
                        handleValueChange={handleValueChange}
                    />
                </div>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Comprobante de pago</h4>
                    <PaymentProofTable
                        data={paymentProofs}
                    />
                </div>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        Guardar
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    );
};
export default SellerInfoModal