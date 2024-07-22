import { Modal, Form, Input, InputNumber, Button, Radio, message, Col, Row } from 'antd';
import { UserOutlined, PhoneOutlined, CommentOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { registerSalesAPI } from '../../api/sales';

function SalesFormModal({ visible, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);

    const [montoCobradoDelivery, setMontoCobradoDelivery] = useState<number>(0);
    const [costoRealizarDelivery, setCostoRealizarDelivery] = useState<number>(0);

    const handleFinish = async (salesData: any) => {
        setLoading(true);
        const response = await registerSalesAPI(salesData);
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

    return (
        <Modal
            title="Pagos Form"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                name="salesForm"
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="montoTotal"
                            label="Monto Total de la Venta"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input />
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
                                <Radio.Button value='1'>Transferencia o QR</Radio.Button>
                                <Radio.Button value='2'>Efectivo</Radio.Button>
                                <Radio.Button value='3'>Pagado al dueño</Radio.Button>
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
