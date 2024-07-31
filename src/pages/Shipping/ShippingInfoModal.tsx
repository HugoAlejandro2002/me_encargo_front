import { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Row, Col, TimePicker, Radio, InputNumber } from 'antd';
import moment from 'moment';
import { getProductByShippingAPI } from '../../api/sales';
import EmptySalesTable from '../Sales/EmptySalesTable';
import useProducts from '../../hooks/useProducts';
import useEditableTable from '../../hooks/useEditableTable';

const ShippingInfoModal = ({ visible, onClose, order, onSave }: any) => {
    const [adelantoVisible, setAdelantoVisible] = useState(false);
    const [adelantoClienteInput, setAdelantoClienteInput] = useState<number>(0);
    const [selectedProducts, setSelectedProducts,handleValueChange] = useEditableTable([])
    const [products, setProducts] = useState<Product[]>([]);
    
    const { data } = useProducts();
    const [form] = Form.useForm();

    useEffect(() => {
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
        if (order && order.id_pedido) {
            getProductByShippingAPI(order.id_pedido).then((data: any[]) => {
                // Asegúrate de que `data` sea un array
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                    console.error('Expected data to be an array', data);
                }
            });
        }
        console.log(order+ "yaaa")
    }, [order, form]);
    // console.log(order)

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

    const handleProductSelect = (product: any) => {
        // setEditableProducts((prevProducts: any) => {
        setProducts((prevProducts: any) => {
            const exists = prevProducts.find((p: any) => p.key === product.key);
            if (!exists) {
                return [...prevProducts, { ...product, cantidad: 1, precio_unitario: product.precio, utilidad: 1 }];
            }
            return prevProducts;
        });
    };
    const handleDeleteProduct = (key: any) => {
        setProducts((prevProducts: any) => {
            const updatedProducts = prevProducts.filter((product: any) => product.key !== key);
            return updatedProducts;
        });
    };

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
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="fecha_pedido"
                            label="Fecha de la entrega"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="hora_entrega_acordada"
                            label="Hora de entrega"
                        >
                            <TimePicker format="HH:mm" />

                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="hora_entrega_real"
                            label="Hora de Entrega Final"
                        >
                            <TimePicker format="HH:mm" />

                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="observaciones"
                    label="Comentarios"
                >
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="telefono_cliente"
                            label="Celular"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lugar_entrega"
                            label="Lugar de entrega"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name='pagado_al_vendedor'
                            label='¿Está ya pagado?'
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
                {adelantoVisible && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name='adelanto_cliente2'
                                label='Adelanto Cliente'
                                initialValue={0}
                            >
                                <Input
                                    prefix='Bs.'
                                    onChange={((e: any) => setAdelantoClienteInput(e))}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                <Form.Item>
                    <EmptySalesTable
                        products={products}
                        onDeleteProduct={handleDeleteProduct} // Implementar si es necesario
                        onUpdateTotalAmount={() => {}} // Implementar si es necesario
                        handleValueChange={() => {}} // Implementar si es necesario
                    />
                </Form.Item>
                <Form.Item
                    name="productos_lista"
                    label="Producto"
                >
                    <Select
                        placeholder="Selecciona un producto"
                        options={data.map((product: any) => ({
                            value: product.id_producto,
                            label: product.producto,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleProductSelect}
                    />
                </Form.Item>
                <Form.Item
                    name="monto_total"
                    label="Monto Total de la Venta"
                >
                    <Input disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ShippingInfoModal;
