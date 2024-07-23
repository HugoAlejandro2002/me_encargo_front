import { useState } from "react";
import { Form, Input, InputNumber, Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FeatureInputs = ({ features, selectedFeatures, featureValues, setFeatureValues, combinations, setCombinations }: any) => {
    const [inputValues, setInputValues] = useState<any>({});
    const [combinationInputs, setCombinationInputs] = useState<any>({});

    const handleInputChange = (featureId: any, value: any) => {
        setInputValues((prev: any) => ({ ...prev, [featureId]: value }));
    };

    const handleCombinationInputChange = (featureId: any, value: any) => {
        setCombinationInputs((prev: any) => ({ ...prev, [featureId]: value }));
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
        render: (text: any, record: any) => (
            <Input
                value={text}
                onChange={(e) => handleCombinationChange(record.key, featureId, e.target.value)}
            />
        )
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
            <div>
                <h3>Agregar Combinación</h3>
                <Form layout="inline">
                    {selectedFeatures.map((featureId: any) => (
                        <Form.Item key={featureId} label={features.find((f: any) => f.id_caracteristicas === featureId)?.feature}>
                            <Input
                                value={combinationInputs[featureId] || ''}
                                onChange={(e) => handleCombinationInputChange(featureId, e.target.value)}
                                placeholder={`Agregar valor para ${features.find((f: any) => f.id_caracteristicas === featureId)?.feature}`}
                            />
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
