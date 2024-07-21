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
    const [features, setFeatures] = useState([])
    const [selectedFeatures, setSelectedFeatures] = useState([])
    const [featureValues, setFeatureValues] = useState({})

    const handleFinish = async (productData: any) => {
        setLoading(true)
        productData.imagen = ''
        const response = await registerProductAPI(productData)
        setLoading(false)
        if (response.status) {
            const newProduct = response.newProduct
            message.success('Producto registrado con éxito')
            console.log(newProduct.id_Producto, featureValues, 'xdd')
            await addFeaturesToProduct(newProduct.id_Producto, featureValues)
            fetchCategories()
            onSuccess()
        } else {
            message.error('Error al registrar el producto')
        }
    }

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

    const createFeature = async () => {
        setLoading(true)
        console.log(newFeature, typeof newFeature)
        const res = await registerFeatureAPI({ nombre: newFeature })
        setLoading(false)
        if (res.status) {
            message.success('Caracteristica creada con exito')
            fetchFeatures()
            setNewFeature('')
        } else {
            message.error('Error al crear caracteristica')
            console.log(res)
        }
    }

    const addFeaturesToProduct = async (productId: any, featureValues: any) => {
        setLoading(true)
        // selectedFeatures.forEach(async (item: any) => {
        //     const res = await addProductFeatureAPI({ product: productId, featureId: item.id_Caracteristicas, value: featureValue })
        //     if(!(res.status)) {
        //         message.success("Error al agregar las características")
        //         console.log(res)
        //     }
        // })
        for (const element of selectedFeatures) {
            const feature: any = element
            const featureId: any = feature.id_Caracteristicas
            const value = featureValues[featureId]
            const res = await addProductFeatureAPI({ productId: productId, featureId: featureId, value: value })
        }
        message.success('Características agregadas con éxito!')
        setLoading(false)

    }

    const fetchSellers = async () => {
        try {
            const response = await getSellersAPI()
            setSellers(response)
        } catch (error) {
            message.error('Error al obtener los vendedores')
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getCategoriesAPI()
            setCategories(response)
        } catch (error) {
            message.error('Error al obtener las categorías')
        }
    }

    const fetchFeatures = async () => {
        try {
            const res = await getFeaturesAPI()
            setFeatures(res)
        } catch (error) {
            message.error('Error al obtener las características')

        }
    }

    useEffect(() => {
        fetchSellers()
        fetchCategories()
        fetchFeatures()
    }, [])

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
                    name="id_Vendedor"
                    label="Marca"
                    rules={[{ required: true, message: 'Por favor seleccione una marca' }]}
                >
                    <Select
                        placeholder="Selecciona una marca"
                        options={sellers.map((seller: any) => ({
                            value: seller.id_Vendedor,
                            label: seller.marca,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="id_Categoria"
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
                            value: category.id_Categoria,
                            label: category.categoria,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name='id_Caracteristica'
                    label='Características'
                >
                    <Select
                        placeholder='Selecciona una característica'
                        mode="tags"
                        value={selectedFeatures}
                        onChange={((values: any) => setSelectedFeatures(values))}
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
                        options={features.map((feature: any) => ({
                            value: feature.id_Caracteristicas,
                            label: feature.nombre,
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLocaleLowerCase())
                        }
                    />
                </Form.Item>

                <FeatureInputs
                    selectedFeatures={selectedFeatures}
                    featureValues={featureValues}
                    setFeatureValues={setFeatureValues}
                />

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Registrar Producto
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ProductFormModal
