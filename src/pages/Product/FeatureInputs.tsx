import { useState } from "react";
import { Form, Tag, Input, Space, InputNumber, Table, Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FeatureInputs = ({ features, selectedFeatures, featureValues, setFeatureValues, combinations, setCombinations }: any) => {
    const [inputValues, setInputValues] = useState<any>({});
    const [combinationInputs, setCombinationInputs] = useState<any>({});

    const handleInputChange = (featureId: any, value: any) => {
        setInputValues((prev: any) => ({ ...prev, [featureId]: value }));
    };

    const addValue = (featureId: any) => {
        const value = inputValues[featureId];
        if (value && value.trim() !== "") {
            setFeatureValues((prev: any) => ({
                ...prev,
                [featureId]: [...(prev[featureId] || []), value.trim()]
            }));
            setInputValues((prev: any) => ({ ...prev, [featureId]: '' }));
        }
    };

    const addCombination = () => {
        const newCombination = { key: combinations.length, ...combinationInputs, stock: 0, price: 0 };
        setCombinations([...combinations, newCombination]);
        setCombinationInputs({});
    };

    const handleCombinationChange = (key: any, field: any, value: any) => {
        setCombinations(combinations.map((comb: any) => comb.key === key ? { ...comb, [field]: value } : comb));
    };

    const columns = selectedFeatures.map((featureId: any) => ({
        title: features.find((f: any) => f.id_caracteristicas === featureId)?.feature,
        dataIndex: featureId,
        key: featureId,
    })).concat([
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (text: any, record: any) => (
                <InputNumber min={0} value={text} onChange={(value) => handleCombinationChange(record.key, 'stock', value)} />
            )
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            render: (text: any, record: any) => (
                <InputNumber min={0} value={text} onChange={(value) => handleCombinationChange(record.key, 'price', value)} />
            )
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="link" onClick={() => setCombinations(combinations.filter((comb: any) => comb.key !== record.key))}>
                    Eliminar
                </Button>
            )
        }
    ]);

    return (
        <>
            {selectedFeatures.map((featureId: any) => (
                <Form.Item key={featureId} label={features.find((f: any) => f.id_caracteristicas === featureId)?.feature}>
                    <Space.Compact>
                        <Input.Search
                            value={inputValues[featureId] || ''}
                            onChange={(e) => handleInputChange(featureId, e.target.value)}
                            style={{ width: 'calc(100%)' }}
                            placeholder={`Agregar valor para ${features.find((f: any) => f.id_caracteristicas === featureId)?.feature}`}
                            enterButton={<PlusOutlined />}
                            onSearch={() => addValue(featureId)}
                        />
                    </Space.Compact>
                    <div style={{ marginTop: 8 }}>
                        {(featureValues[featureId] || []).map((value: any, index: any) => (
                            <Tag
                                key={`${featureId}-${index}`}
                                closable
                                onClose={() => setFeatureValues((prev: any) => ({
                                    ...prev,
                                    [featureId]: prev[featureId].filter((v: any) => v !== value)
                                }))}
                                style={{ marginBottom: 8 }}
                            >
                                {value}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
            ))}

            <div>
                <h3>Agregar Combinación</h3>
                <Form layout="inline">
                    {selectedFeatures.map((featureId: any) => (
                        <Form.Item key={featureId} label={features.find((f: any) => f.id_caracteristicas === featureId)?.feature}>
                            <Select
                                value={combinationInputs[featureId]}
                                onChange={(value) => setCombinationInputs((prev: any) => ({ ...prev, [featureId]: value }))}
                                style={{ width: 120 }}
                            >
                                {(featureValues[featureId] || []).map((value: any) => (
                                    <Select.Option key={value} value={value}>{value}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button type="primary" onClick={addCombination}>Agregar</Button>
                    </Form.Item>
                </Form>
            </div>

            <Table dataSource={combinations} columns={columns} pagination={false} />
        </>
    );
};

export default FeatureInputs;
