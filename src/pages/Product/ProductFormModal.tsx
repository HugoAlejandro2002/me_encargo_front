import { Select, Button, Form, Input, Modal, message } from "antd"
import { useEffect, useState } from "react"
import { addProductFeatureAPI, registerProductAPI } from "../../api/product"
import { getSellersAPI } from "../../api/seller"
import { getCategoriesAPI, registerCategoryAPI } from "../../api/category"
import { getFeaturesAPI, registerFeatureAPI } from "../../api/feature"
import FeatureInputs from "./FeatureInputs"

const ProductFormModal = ({ visible, onCancel, onSuccess }: any) => {
    const [loading, setLoading] = useState(false)
    const [sellers, setSellers] = useState([])
    const [categories, setCategories] = useState([])
    const [newCategory, setNewCategory] = useState('')
    const [newFeature, setNewFeature] = useState('')
    const [features, setFeatures] = useState<any>([])
    const [selectedFeatures, setSelectedFeatures] = useState([])
    const [featureValues, setFeatureValues] = useState({})
    const [combinations, setCombinations] = useState([])

    const handleFinish = async (productData: any) => {
        setLoading(true);
        console.log(productData, 'dataproduct')
        console.log(combinations, 'combinaciones data')

        setLoading(false);

    };

    const createCategory = async () => {
        if (!newCategory) return
        setLoading(true)
        const response = await registerCategoryAPI({ categoria: newCategory })
        setLoading(false)
        if (response.status) {
            message.success('Categoría creada con éxito')
            fetchCategories()
            setNewCategory('')
        } else {
            message.error('Error al crear categoría')
        }
    }

    // const createFeature = async () => {
    //     setLoading(true)
    //     const res = await registerFeatureAPI({ nombre: newFeature })
    //     setLoading(false)
    //     if (res.status) {
    //         message.success('Caracteristica creada con exito')
    //         fetchFeatures()
    //         setNewFeature('')
    //     } else {
    //         message.error('Error al crear caracteristica')
    //     }
    // }
    const createFeature = () => {
        if (!newFeature) return;
        const newFeatureObj = { feature: newFeature, id_caracteristicas: Date.now() }; // Generar un id temporal
        setFeatures([...features, newFeatureObj]);
        setNewFeature('');
        message.success('Característica agregadatemporalmente');
    };

    const addFeaturesToProduct = async (productId: any, featureValues: any) => {
        setLoading(true)
        const combinations = generateCombinations(featureValues)

        for (const combination of combinations) {
            const featureText = combination.map((item: any) => `${item.feature}: ${item.value}`).join(", ")
            const response = await addProductFeatureAPI({
                productId: productId,
                featureText: featureText,
                stock: combination.stock,
                price: combination.price,
            });

            if (!response.status) {
                message.error(`Error al agregar la combinación ${featureText}`);
            }
        }

        message.success('Características agregadas con éxito!');
        setLoading(false);
    };

    const generateCombinations = (featureValues: any) => {
        const keys = Object.keys(featureValues);
        if (keys.length === 0) return [];

        const combinations: any = [];
        const generate = (index: any, current: any) => {
            if (index === keys.length) {
                combinations.push({ ...current });
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

    const fetchSellers = async () => {
        try {
            const response = await getSellersAPI();
            setSellers(response);
        } catch (error) {
            message.error('Error al obtener los vendedores');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAPI();
            setCategories(response);
        } catch (error) {
            message.error('Error al obtener las categorías');
        }
    };

    const fetchFeatures = async () => {
        try {
            const res = await getFeaturesAPI();
            console.log(res, 'fetched features')
            setFeatures(res);
        } catch (error) {
            message.error('Error al obtener las características');
        }
    };

    useEffect(() => {
        fetchSellers();
        fetchCategories();
        fetchFeatures();
    }, []);

    const uniqueFeatures = Array.from(new Set(features.map((feature: any) => feature.feature)));

    const filteredOptions = uniqueFeatures.map((label: any) => ({
        label: label,
        value: features.find((feature: any) => feature.feature === label).id_caracteristicas
    }));

    return (
        <Modal
            title="Agregar Producto"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                name="productForm"
                onFinish={handleFinish}
                layout="vertical"
            >
                <Form.Item
                    name="nombre_producto"
                    label="Nombre del Producto"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
                >
                    <Input placeholder="Nombre del Producto" />
                </Form.Item>
                <Form.Item
                    name="precio"
                    label="Precio"
                    rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
                >
                    <Input type="number" placeholder="Precio" />
                </Form.Item>
                <Form.Item
                    name="id_vendedor"
                    label="Marca"
                    rules={[{ required: true, message: 'Por favor seleccione una marca' }]}
                >
                    <Select
                        placeholder="Selecciona una marca"
                        options={sellers.map((seller: any) => ({
                            value: seller.id_vendedor,
                            label: seller.marca,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="id_categoria"
                    label="Categoría"
                    rules={[{ required: true, message: 'Por favor seleccione una categoría' }]}
                >
                    <Select
                        placeholder="Selecciona una categoría"
                        dropdownRender={menu => (
                            <>
                                {menu}
                                <div style={{ display: 'flex', padding: 8 }}>
                                    <Input
                                        style={{ flex: 'auto' }}
                                        value={newCategory}
                                        onChange={e => setNewCategory(e.target.value)}
                                    />
                                    <Button
                                        type="link"
                                        onClick={createCategory}
                                        loading={loading}
                                    >
                                        Añadir categoría
                                    </Button>
                                </div>
                            </>
                        )}
                        options={categories.map((category: any) => ({
                            value: category.id_categoria,
                            label: category.categoria,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name='id_caracteristicas'
                    label='Características'
                >
                    <Select
                        placeholder='Selecciona una característica'
                        mode="multiple"
                        value={selectedFeatures}
                        onChange={setSelectedFeatures}
                        dropdownRender={menu => (
                            <>
                                {menu}
                                <div className="flex p-2">
                                    <Input
                                        className="flex-auto"
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                    />
                                    <Button
                                        type="link"
                                        onClick={createFeature}
                                        loading={loading}
                                    >
                                        Añadir característica
                                    </Button>
                                </div>
                            </>
                        )}
                        options={filteredOptions}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLocaleLowerCase())
                        }
                    />
                </Form.Item>

                <FeatureInputs
                    features={features}
                    selectedFeatures={selectedFeatures}
                    featureValues={featureValues}
                    setFeatureValues={setFeatureValues}
                    combinations={combinations}
                    setCombinations={setCombinations}
                />

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Registrar Producto
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;
