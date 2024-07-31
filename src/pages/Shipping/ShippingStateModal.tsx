import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Row, Col, TimePicker, Radio, InputNumber } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';

const ShippingStateModal = ({ visible, onClose, order, onSave }: any) => {
    const [estadoPedido, setEstadoPedido] = useState(null);
    const [montoCobradoDelivery, setMontoCobradoDelivery] = useState<number>(0);
    const [costoRealizarDelivery, setCostoRealizarDelivery] = useState<number>(0);
    const [form] = Form.useForm();

    // const tipoPagoMap: any = {
    //     1: 'Transferencia o QR',
    //     2: 'Efectivo',
    //     3: 'Pagado al dueño'
    // }
    // const estadoPedidoMap: any = {
    //     1: 'En espera',
    //     2: 'Por entregar',
    //     3: 'Entregado'
    // }
    // const intTipoPago = parseInt(order.tipo_de_pago)
    // const intEstadoPedido = parseInt(order.estado_pedido)

    React.useEffect(() => {
        if (order) {
            form.setFieldsValue({
                ...order,
                fecha_pedido: order.fecha_pedido ? moment(order.fecha_pedido, 'YYYY-MM-DD HH:mm:ss.SSS') : null,
                hora_entrega_acordada: order.hora_entrega_acordada ? moment(order.hora_entrega_acordada, 'YYYY-MM-DD HH:mm:ss.SSS') : null,
                hora_entrega_real: order.hora_entrega_real ? moment(order.hora_entrega_real, 'YYYY-MM-DD HH:mm:ss.SSS') : null,
                hora_final: order.hora_final || '',
                observaciones: order.observaciones || '',
                telefono_cliente: order.telefono_cliente || '',
                monto_total: order.monto_total || '',
                pagado_al_vendedor: order.pagado_al_vendedor || '',
            });
        }
    }, [order, form]);

    const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue + value).toFixed(2)));
    };

    const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prevValue => parseFloat((prevValue - value).toFixed(2)));
    };

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                onSave({ ...order, ...values });
                onClose();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };
    const handleEstadoChange = (e:any) => {
        setEstadoPedido(e.target.value);
    };

    return (
        <Modal
            title={`Estado del pedido ${order ? order.id_pedido : ''}`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave}>
                    Guardar
                </Button>
            ]}
            centered
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                name="shipping_info_form"
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='estado_pedido'
                            label='Estado Pedido'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group onChange={handleEstadoChange}>
                                <Radio.Button value='1'>En espera</Radio.Button>
                                <Radio.Button value='2'>Por entregar</Radio.Button>
                                <Radio.Button value='3'>Entregado</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                {estadoPedido == '2' && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="hora_entrega_acordada"
                                label="Hora de entrega"
                            >
                                <TimePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                {estadoPedido == '3' && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="cargo_delivery"
                                    label="Monto cobrado por el Delivery"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputNumber
                                            className="no-spin-buttons"
                                            prefix='Bs.'
                                            value={montoCobradoDelivery}
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
                            <Col span={12}>
                                <Form.Item
                                    name="costo_delivery"
                                    label="Costo de realizar el Delivery"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputNumber
                                            className="no-spin-buttons"
                                            prefix='Bs.'
                                            value={costoRealizarDelivery}
                                            onKeyDown={(e) => {
                                                if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete' && e.key !== 'Enter') {
                                                    e.preventDefault();
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
                                name='tipo_de_pago'
                                label='Tipo de pago'
                            >
                                <Radio.Group>
                                    <Radio.Button value='1'>Transferencia o QR</Radio.Button>
                                    <Radio.Button value='2'>Efectivo</Radio.Button>
                                    <Radio.Button value='3'>Pagado al dueño</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default ShippingStateModal;
