import { Button, DatePicker, Form, Input, InputNumber, message, Modal } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import CustomTable from "./components/SalesTable";
import { getProductsBySellerIdAPI } from "../../api/sales";
import { getShipingByIdsAPI } from "../../api/shipping";
import StockSellerTable from "./components/StockSellerTable";
import { updateSellerAPI } from "../../api/seller";
import { getProductAndStockBySellerId } from "../../api/product";
import { getSucursalsAPI } from "../../api/sucursal";

const SellerInfoModal = ({ visible, onSuccess, onCancel, seller }: any) => {

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [productsAndStock, setProductsAndStock] = useState<any[]>([]);
    const [totalAdelantoCliente, setTotalAdelantoCliente] = useState(0);
    const [totalNoPagadas, setTotalNoPagadas] = useState(0);
    const [totalHistorial, setTotalHistorial] = useState(0);
    const [deudaCalculada, setDeudaCalculada] = useState(0);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [sucursalesLoaded, setSucursalesLoaded] = useState(false);


    const fetchSucursales = async () => {
        try{
            const response = await getSucursalsAPI();
            setSucursales(response);
            setSucursalesLoaded(true);
        }catch(error){
            console.log('Error fetching sucursales:',error)
        }
    }
    const fetchProducts = async () => {
        try {
            const response = await getProductsBySellerIdAPI(seller.key);
            const productos = Array.isArray(response) ? response : [];

            const pedidos = response.map((product: any) => product.id_pedido);
            const uniquePedidos = Array.from(new Set<number>(pedidos));

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
                    };
                });
                setProducts(productosConTipo);
            } else {
                console.error('Error fetching shippings:', shippingsResponse);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchProductsAndStock = async () => {
        try {
            const response = await getProductAndStockBySellerId(seller.key);
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
        message.success('Vendedor editado con éxito')
        onSuccess()
        setLoading(false)
    }
    const ventasNoPagadas = products.filter(product => product.deposito_realizado === false);
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
                    <h3>Total historico - adelantos</h3>
                    <h2>{`Bs. ${totalHistorial - totalAdelantoCliente}`}</h2>
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
                <Form.Item
                    name="pago_mensual"
                    label='Pago Mensual'
                    initialValue={seller.alquiler + seller.exhibicion + seller.delivery}
                >
                    <InputNumber
                        prefix='Bs.'
                        min={0}
                        readOnly
                    />
                </Form.Item>
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
                        data={ventasNoPagadas}
                        onUpdateTotalAmount={setTotalNoPagadas}
                        // onDeleteProduct={}
                        // onUpdateTotalAmount={}
                        // handleValueChange={}
                        showClient={true}
                    />
                </div>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Historial de ventas</h4>
                    <CustomTable
                        data={products}
                        onUpdateTotalAmount={setTotalHistorial}
                        // onDeleteProduct={}
                        // onUpdateTotalAmount={}
                        // handleValueChange={}
                        showClient={false}
                    />
                </div>
                <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: 20 }}>Historial de ingreso</h4>
                    <StockSellerTable
                        data={productsAndStock}
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