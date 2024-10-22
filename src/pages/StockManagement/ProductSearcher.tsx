import { Select, Input, Button, Form, Row, Col, Collapse, Space} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getCategoriesAPI } from '../../api/category';
import { getSucursalsAPI } from '../../api/sucursal';
import { Option } from 'antd/es/mentions';
import { getFeaturesAPI } from '../../api/feature';
const { Panel } = Collapse;

const ProductSearcher = ( {applySearcher} ) => {

    const [form] = Form.useForm()
    const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
    const [cateogries, setCategories] = useState([])
    const [sucursals, setSucursals] = useState([])
    const [features, setFeatures] = useState([])
    const [available, setAvialable] = useState([])

    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: '', value: '' }]);
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    const resetSearcher = () => {
        setAttributes([{ key: '', value: '' }]);
        form.resetFields(); 
        applySearcher(
            {
                nombre_producto: null,
                id_categoria: null,
                sucursal: null,
                features: null
            }
        )
    }

    const getSearcher = () => {
        const values = form.getFieldsValue()

        const filteredAttributes = attributes.filter(attr => attr.key)

        const criteria = {
            nombre_producto: values.name,
            id_categoria: values.category,
            sucursal: values.sucursal,
            features: filteredAttributes
        }
        applySearcher(criteria)
    }

    const fetchData = async () => {
        const categoriesResponse = await getCategoriesAPI()
        const sucursalResponse = await getSucursalsAPI()
        const featuresResponse = await getFeaturesAPI()

        const uniqueFeatures = [...new Set(featuresResponse.map(feature => feature.feature))]

        setCategories(categoriesResponse)
        setSucursals(sucursalResponse)
        setFeatures(uniqueFeatures)
        setAvialable(uniqueFeatures)
    }

    useEffect(() => {
        fetchData()
    },[])

    return (
        <Collapse accordion style={{margin: 20, marginTop:30}}>
            <Panel header="Buscador" key={1}>
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={6}>
                        <Form.Item name="category" label="Category">
                            <Select showSearch placeholder="Select category"
                                    filterOption={(input, option: any) =>
                                        option.key.toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    >
                                {
                                    cateogries.map((category) => (
                                        <Option key={category.categoria} 
                                                value={category.id_categoria}
                                        >
                                             {category.categoria}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        </Col>

                        <Col span={6}>
                        <Form.Item name="sucursal" label="Sucursal">
                            <Select showSearch placeholder="Select sucursal"
                                    filterOption={(input, option: any) =>
                                        option.key.toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    >
                                {
                                    sucursals.map((sucursal) => (
                                        <Option key={sucursal.nombre} 
                                                value={sucursal.id_sucursal}
                                        >
                                             {sucursal.nombre}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        </Col>

                        <Col span={6}>
                        <Form.Item name="name" label="Product Name">
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row >
                        <Col span={6}>
                            Caracteristica
                        </Col>
                        <Col span={6}>
                            Valor
                        </Col>
                    </Row>

                    {attributes.map((attribute, index) => (
                        <Row key={index} gutter={16}>
                        <Col span={6}>
                            <Form.Item >
                                <Select showSearch placeholder="Select attribute" value={attribute.key}
                                 onChange={value => {
                                    const newAttributes = [...attributes];
                                    newAttributes[index].key = value;
                                    setAttributes(newAttributes);
                                }}
                                filterOption={(input, option: any) =>
                                    option.value.toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                >
                                    {
                                        available.map((feature, index) => (
                                            <Option key={index} 
                                                    value={feature}
                                            >
                                                {feature}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={attribute.key}>
                                <Input placeholder="Enter value" value={attribute.value} onChange={e => {
                                    const newAttributes = [...attributes];
                                    newAttributes[index].value = e.target.value;
                                    setAttributes(newAttributes);
                                }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Button onClick={() => handleRemoveAttribute(index)}>
                                <DeleteOutlined/>
                            </Button>
                        </Col>
                        </Row>
                    ))}
                    <Row justify="space-between" align="middle">
                        <Col>
                        <Button onClick={handleAddAttribute}>Add Attribute</Button>
                        </Col>
                        <Col>
                        <Space>
                            <Button onClick={resetSearcher}>Reset</Button>
                            <Button onClick={getSearcher}>Apply</Button>
                        </Space>
                        </Col>
                    </Row>

                </Form> 
            </Panel>
        </Collapse>    
    );
};

export default ProductSearcher;
