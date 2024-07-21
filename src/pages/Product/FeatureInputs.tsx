import { Form, Tag, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FeatureInputs = ({ selectedFeatures, featureValues, setFeatureValues }: any) => {
    const addValue = (featureId: any, value: any) => {
        if (value.trim() === "") return;
        setFeatureValues((prev: any) => ({
            ...prev,
            [featureId]: [...(prev[featureId] || []), value.trim()]
        }));
    };

    const removeValue = (featureId: any, valueToRemove: any) => {
        setFeatureValues((prev: any) => ({
            ...prev,
            [featureId]: prev[featureId].filter((v: any) => v !== valueToRemove)
        }));
    };

    return (
        <>
            {selectedFeatures.map((feature: any) => (
                <Form.Item key={feature} label={feature.nombre}>
                    <Input.Group compact>
                        <Input.Search
                            style={{ width: 'calc(100% - 78px)' }}
                            placeholder={`Agregar valor para ${feature.nombre}`}
                            enterButton={<PlusOutlined />}
                            onSearch={(value) => {
                                addValue(feature, value);
                                // Clear the input after adding
                                const input = document.querySelector(`input[placeholder="Agregar valor para ${feature.nombre}"]`) as HTMLInputElement
                                if (input) input.value = '';
                            }}
                        />
                    </Input.Group>
                    <div style={{ marginTop: 8 }}>
                        {(featureValues[feature] || []).map((value: any, index: any) => (
                            <Tag
                                key={`${feature}-${index}`}
                                closable
                                onClose={() => removeValue(feature, value)}
                                style={{ marginBottom: 8 }}
                            >
                                {value}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
            ))}
        </>
    );
};

export default FeatureInputs;
