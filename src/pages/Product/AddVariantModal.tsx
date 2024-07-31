import { Modal, Button, Form, Input, InputNumber, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const AddVariantModal = ({ visible, onCancel, onAdd, group }) => {
    const [form] = Form.useForm();
    const [features, setFeatures] = useState([{ feature: '', value: '' }]);
    const [selectedFeatures, setSelectedFeatures] = useState(new Set());
    
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log({values, onAdd, group})
            const featuresFilter = features.filter(feat => feat.feature!== "")

            const example = group.products[0]
            const variant = {
                product:{
                    ...values,
                    groupId: group.id,
                    id_categoria: example.id_categoria,
                    id_vendedor: example.id_vendedor
                },
                featuresFilter
            }

            await onAdd(variant);
            
            form.resetFields();
            setFeatures([{ feature: '', value: '' }]); // Reset features state
            setSelectedFeatures(new Set()); // Reset selected features state
        } catch (error) {
            console.error('Failed to add variant:', error);
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...features];
        const prevFeature = newFeatures[index].feature;

        // Remove the previously selected feature if it exists
        if (prevFeature) {
            selectedFeatures.delete(prevFeature);
        }

        newFeatures[index].feature = value;
        setFeatures(newFeatures);
        setSelectedFeatures(new Set([...selectedFeatures, value]));

        // If the last feature-value pair is filled, add a new empty pair
        if (index === features.length - 1 && value) {
            setFeatures([...features, { feature: '', value: '' }]);
        }

    }

    const handleValueChange = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index].value = value;
        setFeatures(newFeatures);
    };

    // Filter out already selected features from the dropdown
    const getAvailableFeatures = (index) => {
        const selected = new Set(features.map(f => f.feature));

        if (features[index].feature) {
            selected.delete(features[index].feature);
        }
        return group.features.filter(f => !selected.has(f));
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
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Precio"
                    name="precio"
                    rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
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
                            <Select
                                placeholder="Seleccionar característica"
                                value={feature.feature}
                                style={{ marginRight: 8, flex: 1 }}
                                onChange={(value) => handleFeatureChange(index, value)}
                            >
                                {getAvailableFeatures(index).map((featureOption, idx) => (
                                    <Option key={idx} value={featureOption}>{featureOption}</Option>
                                ))}
                            </Select>
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
