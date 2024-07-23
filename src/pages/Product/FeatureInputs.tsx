import { useState, useEffect } from "react";
import { Form, Tag, Input, Space, InputNumber, Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FeatureInputs = ({ features, selectedFeatures, featureValues, setFeatureValues , combinations, setCombinations}: any) => {
    const [inputValues, setInputValues] = useState<any>({});
    // const [combinations, setCombinations] = useState<any>([]);

    useEffect(() => {
        if (selectedFeatures.length > 0) {
            const newCombinations: any = generateCombinations(featureValues);
            setCombinations(newCombinations);
        }
    }, [featureValues, selectedFeatures]);

    const generateCombinations = (featureValues: any) => {
        const keys = Object.keys(featureValues);
        if (keys.length === 0) return [];

        const combinations: any = [];
        const generate = (index: any, current: any) => {
            if (index === keys.length) {
                combinations.push({ ...current, key: combinations.length, stock: 0, price: 0 });
                return;
            }

            const featureId = keys[index];
            for (const value of featureValues[featureId] || []) {
                generate(index + 1, { ...current, [featureId]: value });
            }
        };

        generate(0, {});
        return combinations;
    };

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

    const removeCombination = (key: any) => {
        setCombinations(combinations.filter((comb: any) => comb.key !== key));
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
                <Button type="link" onClick={() => removeCombination(record.key)}>Eliminar</Button>
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
                                onClose={() => removeCombination(featureId)}
                                style={{ marginBottom: 8 }}
                            >
                                {value}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
            ))}
            <Table dataSource={combinations} columns={columns} pagination={false} />
        </>
    );
};

export default FeatureInputs;
