import { Modal, Form, Input, InputNumber, Button, Radio, message, Col, Row } from 'antd';
import { UserOutlined, PhoneOutlined, CommentOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { registerShippingAPI } from '../../api/shipping';

function SalesFormModal({ visible, onCancel, onSuccess, selectedProducts, totalAmount }: any) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [montoCobradoDelivery, setMontoCobradoDelivery] = useState<number>(0);
    const [costoRealizarDelivery, setCostoRealizarDelivery] = useState<number>(0);

    useEffect(() => {
        form.setFieldsValue({
            montoTotal: `Bs. ${totalAmount ? totalAmount.toFixed(2) : '0.00'}`,
        });
    }, [totalAmount]);

    const tipoPagoMap: any = {
        1: 'Transferencia o QR',
        2: 'Efectivo',
        3: 'Pagado al dueño'
    }
    const handleFinish = async (salesData: any) => {
        setLoading(true);
        const intTipoPago: number = parseInt(salesData.tipoDePago)
        console.log(selectedProducts)
        const apiSalesData = {
            "tipo_de_pago": tipoPagoMap[intTipoPago],
            "observaciones": salesData.comentarios,
            "lugar_entrega": "Me Encargo",
            "costo_delivery": salesData.costoRealizarDelivery,
            "cargo_delivery": salesData.montoCobradoDelivery,
            "estado_pedido": "entregado",
            "adelanto_cliente": 0,
            "pagado_al_vendedor": 0,
            "subtotal_qr": 0,
            "subtotal_efectivo": 0,
            "id_trabajador": 1,
            // SUCURSAL PRADO POR DEFECTO, CAMBIAR CUANDO EXISTAN MAS SUCURSALES
            "id_sucursal": 3,
            "cliente": salesData.cliente,
            "telefono_cliente": salesData.celular
        }

        if (intTipoPago === 1) {
            apiSalesData.subtotal_qr = salesData.montoTotal
        } else if (intTipoPago === 2) {
            apiSalesData.subtotal_efectivo = salesData.montoTotal
        } else if (intTipoPago === 3) {
            apiSalesData.pagado_al_vendedor = 1
        }

        const response = await registerShippingAPI(apiSalesData);
        console.log(apiSalesData)
        if (response.success) {
            message.success('Venta registrada con éxito');
            await createSales(response.newShipping, selectedProducts)
            onSuccess();
        } else {
            message.error('Error al registrar la venta');
        }
        setLoading(false);
    };


    console.log(selectedProducts, 'xd?')
    const createSales = async (shipping: any, productsToAdd: any) => {return}


    const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue + value).toFixed(2)));
    };

    const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue - value).toFixed(2)));
    };

    return (
        <Modal
            title="Pagos Form"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                name="salesForm"
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="montoTotal"
                            label="Monto Total de la Venta"
                        >
                            <Input
                                value={`Bs. ${totalAmount ?? 0}`} // Usa el valor formateado aquí
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='tipoDePago'
                            label='Tipo de pago'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value='1'>{tipoPagoMap[1]}</Radio.Button>
                                <Radio.Button value='2'>{tipoPagoMap[2]}</Radio.Button>
                                <Radio.Button value='3'>{tipoPagoMap[3]}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={20}>
                        <Form.Item
                            name="montoCobradoDelivery"
                            label="Monto cobrado por el Delivery"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <InputNumber
                                    className="no-spin-buttons"
                                    value={montoCobradoDelivery}
                                    prefix='Bs.'
                                    // formatter={(value: any) => `Bs. ${value}`}
                                    // parser={(value: string | undefined) => {
                                    //     return value ? parseFloat(value.replace('Bs. ', '')) : 0;
                                    // }}
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
                    <Col span={20}>
                        <Form.Item
                            name="costoRealizarDelivery"
                            label="Costo de realizar el Delivery"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <InputNumber
                                    className="no-spin-buttons"
                                    value={costoRealizarDelivery}
                                    prefix={'Bs. '}
                                    // formatter={(value) => `Bs. ${value}`}
                                    // parser={(value) => value ? parseFloat(value.replace('Bs. ', '')) : 0}
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
                    <Col span={24}>
                        <Form.Item
                            name="cliente"
                            label="Cliente"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="celular"
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
                    <Col span={24}>
                        <Form.Item
                            name="comentarios"
                            label="Comentarios"
                        >
                            <Input prefix={<CommentOutlined />} />
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
    );
}

export default SalesFormModal;
