import React from 'react';
import { Modal, Button, Form, Input, DatePicker } from 'antd';

const ShippingInfoModal = ({ visible, onClose, order, onSave }: any) => {
    const [form] = Form.useForm();
    React.useEffect(() => {
        if (order) {
            form.setFieldsValue({
                ...order,
                fecha_pedido: order.fecha_entrega ? new Date(order.fecha_entrega) : null,
                hora_entrega_acordada: order.hora_entrega_acordada || '',
                hora_entrega_real: order.hora_entrega_real || '',
                hora_final: order.hora_final || '',
                observaciones: order.observaciones || '',
                telefono_cliente: order.telefono_cliente || '',
                monto_total: order.monto_total || '',
                pagado_al_vendedor: order.pagado_al_vendedor || '',
            });
        }
    }, [order, form]);

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
    console.log(order + "Esto nonononno")
    console.log(order + "Esto es ")

    return (
        <Modal
            title={`Detalles del Pedido ${order ? order.id_pedido : ''}`}
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
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                name="shipping_info_form"
            >
                <Form.Item
                    name="fecha_pedido"
                    label="Fecha de la entrega"
                    rules={[{ required: true, message: 'Por favor, seleccione la fecha de entrega' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="hora_entrega_acordada"
                    label="Hora de entrega"
                >
                    <Input placeholder="--:--" />
                </Form.Item>
                <Form.Item
                    name="hora_entrega_real"
                    label="Hora inicial"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="hora_final"
                    label="Hora final"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="observaciones"
                    label="Comentarios"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    name="telefono_cliente"
                    label="Celular"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="monto_total"
                    label="Monto Total de la Venta"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="pagado_al_vendedor"
                    label="Pagado al vendedor"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ShippingInfoModal;
