import { Modal, Form, Input, InputNumber, Button, Radio, message, Col, Row, DatePicker, Select, TimePicker, Table } from 'antd';
import { UserOutlined, PhoneOutlined, CommentOutlined, HomeOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import SalesTable from './SalesTable';
import { getProductsAPI, registerProductAPI } from '../../api/product';
import { registerShippingAPI } from '../../api/shipping';

function ShippingFormModal({ visible, onCancel, onSuccess, products, totalAmount }: any) {
    const [loading, setLoading] = useState(false);
    const [montoCobradoDelivery, setMontoCobradoDelivery] = useState<number>(0);
    const [costoRealizarDelivery, setCostoRealizarDelivery] = useState<number>(0);
    const [seller, setSeller] = useState([])
    const [newSeller, setNewSeller] = useState('')
    const [product, setProduct] = useState([]);
    const [newProduct, setNewProduct] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [qrInput, setQrInput] = useState<number>(0);
    const [efectivoInput, setEfectivoInput] = useState<number>(0);
    const [pagadoAlVendedorInput, setPagadoAlVendedorInput] = useState<number>(0);
    const [montoTotal, setMontoTotal] = useState<number>(0);
    const [adelantoVisible, setAdelantoVisible] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = async (salesData: any) => {
        setLoading(true);
        const response = await registerShippingAPI(salesData);
        setLoading(false);
        if (response.status) {
            message.success('Venta registrada con éxito');
            onSuccess();
        } else {
            message.error('Error al registrar la venta');
        }
    };

    const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue + value).toFixed(2)));
    };

    const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue - value).toFixed(2)));
    };

    const createProduct = async () => {
        if (!newProduct) return
        setLoading(true)
        const response = await registerProductAPI({ product: newProduct })
        setLoading(false)
        if (response.status) {
            message.success('Producto creado con éxito')
            fetchProducts()
            setNewProduct('')
        } else {
            message.error('Error al crear producto')
        }
    }
    const fetchProducts = async () => {
        try {
            const response = await getProductsAPI()
            setProduct(response)
        } catch (error) {
            message.error('Error al obtener los productos')
        }
    }

    useEffect(() => {
        setMontoTotal(qrInput + efectivoInput - pagadoAlVendedorInput);
        fetchProducts();
    }, [qrInput, efectivoInput, pagadoAlVendedorInput]);

    const createSeller = async () => {

    }

    return (
        <Modal
            title="Pagos Form"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                name="shippingForm"
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="cliente"
                            label="Nombre Cliente"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="telefono_cliente"
                            label="Celular"
                        >
                            <Input
                                onKeyDown={(e) => {
                                    // Verifica si la tecla presionada no es un número
                                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete' && e.key !== 'Enter') {
                                        e.preventDefault();  // Previene la entrada del carácter
                                    }
                                }}
                                prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name='fecha_pedido'
                            label='Fecha de la Entrega'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="hora_entrega_acordada"
                            label="Hora Entrega"
                        >
                            <TimePicker
                                format='HH:mm'
                                style={{ width: '75%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row><Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="horaEntrega"
                            label="Hora Entrega"
                        >
                            <TimePicker
                                format='HH:mm'
                                style={{ width: '75%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="lugar_entrega"
                            label="Lugar De Entrega"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix ={<HomeOutlined />} ></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="observaciones"
                            label="Observaciones"
                        >
                            <Input prefix ={<CommentOutlined/>}></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='tipo_de_pago'
                            label='Tipo de pago'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value='1'>Transferencia o QR</Radio.Button>
                                <Radio.Button value='2'>Efectivo</Radio.Button>
                                <Radio.Button value='3'>Pagado al dueño</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name='subtotal_qr'
                            label='Subtotal QR'
                        >
                            <InputNumber
                                formatter={(value: any) => `Bs. ${value}`}
                                parser={(value: string | undefined) => {
                                    return value ? parseFloat(value.replace('Bs. ', '')) : 0;
                                }}
                                onChange={(e => setQrInput(e))}
                                style={{ width: '50%' }}
                            ></InputNumber>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='subtotal_efectivo'
                            label='Subtotal Efectivo'
                        >
                            <InputNumber
                                formatter={(value: any) => `Bs. ${value}`}
                                parser={(value: string | undefined) => {
                                    return value ? parseFloat(value.replace('Bs. ', '')) : 0;
                                }}
                                onChange={(e => setEfectivoInput(e))}
                                style={{ width: '50%' }}
                            ></InputNumber>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='estado_pedido'
                            label='Estado Pedido'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value='1'>En espera</Radio.Button>
                                <Radio.Button value='2'>Por entregar</Radio.Button>
                                <Radio.Button value='3'>Entregado</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={20}>
                        <Form.Item
                            name="costo_delivery"
                            label="Costo de realizar el Delivery"
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <InputNumber
                                    className="no-spin-buttons"
                                    value={costoRealizarDelivery}
                                    formatter={(value) => `Bs. ${value}`}
                                    parser={(value) => value ? parseFloat(value.replace('Bs. ', '')) : 0}
                                    onKeyDown={(e) => {
                                        // Verifica si la tecla presionada no es un número
                                        if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete' && e.key !== 'Enter') {
                                            e.preventDefault();  // Previene la entrada del carácter
                                        }
                                    }}
                                    min={0}
                                    precision={2}
                                    onChange={(value) => setCostoRealizarDelivery(value ?? 0)}
                                    style={{ flex: 1, marginRight: '8px', width: '80%' }}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleIncrement(setCostoRealizarDelivery, 0.01)}
                                    style={{ marginLeft: '8px' }}
                                />
                                <Button
                                    type="primary"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleDecrement(setCostoRealizarDelivery, 0.01)}
                                    style={{ marginLeft: '8px' }}
                                />
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={20}>
                        <Form.Item
                            name="cargo_delivery"
                            label="Monto cobrado por el Delivery"
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <InputNumber
                                    className="no-spin-buttons"
                                    value={montoCobradoDelivery}
                                    formatter={(value: any) => `Bs. ${value}`}
                                    parser={(value: string | undefined) => {
                                        return value ? parseFloat(value.replace('Bs. ', '')) : 0;
                                    }}
                                    min={0}
                                    precision={2}
                                    onChange={(value) => setMontoCobradoDelivery(value ?? 0)}
                                    style={{ flex: 1, marginRight: '8px', width: '80%' }}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleIncrement(setMontoCobradoDelivery, 0.01)}
                                    style={{ marginLeft: '8px' }}
                                />
                                <Button
                                    type="primary"
                                    icon={<MinusOutlined />}
                                    onClick={() => handleDecrement(setMontoCobradoDelivery, 0.01)}
                                    style={{ marginLeft: '8px' }}
                                />
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='adelanto_cliente'
                            label='¿Está ya pagado?'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group
                                onChange={(e) => setAdelantoVisible(e.target.value === '3')}
                            >
                                <Radio.Button value='1'>Si</Radio.Button>
                                <Radio.Button value='2'>No</Radio.Button>
                                <Radio.Button value='3'>Pago Adelanto</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                

                <Row gutter={16}>
                    <Col span={12}>
                        {adelantoVisible && (
                            <Form.Item
                                name='pagado_al_vendedor'
                                label='Pagado al Vendedor'
                            >
                                <InputNumber
                                    formatter={(value: any) => `Bs. ${value}`}
                                    parser={(value: string | undefined) => {
                                        return value ? parseFloat(value.replace('Bs. ', '')) : 0;
                                    }}
                                    onChange={(e => setPagadoAlVendedorInput(e))}
                                />
                            </Form.Item>
                        )}
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="montoTotal"
                            label="Monto Total"
                            initialValue={montoTotal}
                        >
                            <Input
                                prefix='Bs. '
                                value={montoTotal}
                                defaultValue={qrInput + efectivoInput - pagadoAlVendedorInput}
                                readOnly
                                style={{ width: '25%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="saldoCobrar"
                            label="Saldo a Cobrar"
                            initialValue={totalAmount}
                        >
                            <Input
                                defaultValue={totalAmount}
                                prefix='Bs. '
                                readOnly
                                style={{ width: '25%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ShippingFormModal;