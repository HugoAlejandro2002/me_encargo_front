import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Table, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FeatureInputs = ({ features, selectedFeatures, featureValues, setFeatureValues, combinations, setCombinations }: any) => {
    const [inputValues, setInputValues] = useState<any>({});
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        generateCombinations();
    }, [inputValues]);

    const handleInputChange = (featureId: any, value: any) => {
        setInputValue(value);
    };

    const handleInputConfirm = (featureId: any) => {
        if (inputValue && !inputValues[featureId]?.includes(inputValue)) {
            setInputValues((prev: any) => ({
                ...prev,
                [featureId]: [...(prev[featureId] || []), inputValue],
            }));
            setInputValue('');
        }
    };

    const handleClose = (featureId: any, value: any) => {
        setInputValues((prev: any) => ({
            ...prev,
            [featureId]: prev[featureId].filter((v: any) => v !== value),
        }));
    };

    const generateCombinations = () => {
        if (selectedFeatures.length === 0) return;

        const createCombinations = (values: any) => {
            if (values.length === 0) return [[]];
            const first = values[0];
            const rest = createCombinations(values.slice(1));
            return first.flatMap((v: any) => rest.map((r: any) => [v, ...r]));
        };

        const values = selectedFeatures.map((featureId: any) => inputValues[featureId] || []);
        const combos = createCombinations(values);

        const newCombinations = combos.map((combo: any, index: number) => {
            const combination: any = { key: index };
            selectedFeatures.forEach((featureId: any, idx: number) => {
                combination[featureId] = combo[idx];
            });
            combination.stock = 0;
            combination.price = 0;
            return combination;
        });

        setCombinations(newCombinations);
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
                            {inputValues[featureId]?.map((value: any) => (
                                <Tag
                                    key={value}
                                    closable
                                    onClose={() => handleClose(featureId, value)}
                                >
                                    {value}
                                </Tag>
                            ))}
                            <Input
                                value={inputValue}
                                onChange={(e) => handleInputChange(featureId, e.target.value)}
                                onPressEnter={() => handleInputConfirm(featureId)}
                                placeholder={`Agregar valor para ${features.find((f: any) => f.id_caracteristicas === featureId)?.feature}`}
                            />
                            <Button type="primary" onClick={() => handleInputConfirm(featureId)}>Agregar</Button>
                        </Form.Item>
                    ))}
                </Form>
            </div>

            <Table dataSource={combinations} columns={columns} pagination={false} />
        </>
    );
};

export default FeatureInputs;
