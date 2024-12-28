import { Modal, Form, Input, InputNumber} from 'antd';
import { useState } from 'react';

const AddVariantModal = ({ visible, onCancel, onAdd, group }) => {
    const [form] = Form.useForm();
    
    const example = group.product
    
    const [features, setFeatures] = useState(example.features)

    const handleVariantAdd = async (newVariant) => {
        onAdd(newVariant)
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const featuresFilter = features.filter(feat => feat.feature!== "")

            const variant = {
                product:{
                    ...values,
                    groupId: group.id,
                    id_categoria: example.id_categoria,
                    id_vendedor: example.id_vendedor,
                    categoria: example.categoria,
                    producto_sucursal: [{cantidad_por_sucursal: values.stock}]
                },
                featuresFilter
            }

            handleVariantAdd(variant);
            
            form.resetFields();
        } catch (error) {
            console.error('Failed to add variant:', error);
        }
    };


    const handleValueChange = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index].value = value;
        setFeatures(newFeatures);
    };

    return (
        <Modal
            visible={visible}
            title="Agregar Nueva Variante"
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Nombre del Producto"
                    name="nombre_producto"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
                    initialValue={`${example.nombre_producto}`}
                >
                    <Input className='text-mobile-sm xl:text-desktop-sm' />
                </Form.Item>
                <Form.Item
                    label="Precio"
                    name="precio"
                    rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
                    initialValue={example.precio}
                >
                    <InputNumber min={0} style={{ width: '100%' }} className='text-mobile-sm xl:text-desktop-sm'/>
                </Form.Item>
                <Form.Item
                    label="Cantidad Inicial"
                    name="stock"
                    rules={[{ required: true, message: 'Por favor ingrese la cantidad inicial' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} className='text-mobile-sm xl:text-desktop-sm'/>
                </Form.Item>
                
                <Form.Item
                    label="Características"
                >
                    {features.map((feature, index) => (
                        <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                          
                            <h3 style={{margin: 10}}>{feature.feature}</h3>
                            <Input
                                placeholder="Valor"
                                value={feature.value}
                                style={{ flex: 1 }}
                                onChange={(e) => handleValueChange(index, e.target.value)}
                                className='text-mobile-sm xl:text-desktop-sm'
                            />
                        </div>
                    ))}
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default AddVariantModal;
