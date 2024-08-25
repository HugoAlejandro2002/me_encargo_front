import { Modal, Button, Form, Input, InputNumber, Select } from 'antd';
import { useState } from 'react';
import { addProductFeaturesAPI, registerVariantAPI } from '../../api/product';

const { Option } = Select;

const AddVariantModal = ({ visible, onCancel, onAdd, group }) => {
    const [form] = Form.useForm();
    
    const example = group.product
    
    const [features, setFeatures] = useState(example.features)

    const handleVariantAdd = async (newVariant) => {

        const {product,  featuresFilter:features} = newVariant
        const stock = {
            cantidad_por_sucursal: product.stock,
            //TODO Add Sucursal Field in the form
            id_sucursal: 3
        }
        const {newProduct} = await registerVariantAPI({product,stock})
        await addProductFeaturesAPI({productId: newProduct.id_producto, features})
            
        onAdd()
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log({values, onAdd, group})
            const featuresFilter = features.filter(feat => feat.feature!== "")

            const variant = {
                product:{
                    ...values,
                    groupId: group.id,
                    id_categoria: example.id_categoria,
                    id_vendedor: example.id_vendedor
                },
                featuresFilter
            }

            await handleVariantAdd(variant);
            
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
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Precio"
                    name="precio"
                    rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
                    initialValue={example.precio}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Cantidad Inicial"
                    name="stock"
                    rules={[{ required: true, message: 'Por favor ingrese la cantidad inicial' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
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
                            />
                        </div>
                    ))}
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default AddVariantModal;
