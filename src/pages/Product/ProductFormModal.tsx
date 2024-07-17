import { Select, Button, Form, Input, Modal, message } from "antd"
import { useEffect, useState } from "react"
import { registerProductAPI } from "../../api/product"
import { getSellersAPI } from "../../api/seller"
import { getCategoriesAPI, registerCategoryAPI } from "../../api/category"

const ProductFormModal = ({ visible, onCancel, onSuccess }: any) => {
    const [loading, setLoading] = useState(false)
    const [sellers, setSellers] = useState([])
    const [categories, setCategories] = useState([])

    const handleFinish = async (productData: any) => {
        setLoading(true)
        productData.imagen = ''
        productData.id_Caracteristica = 1
        const response = await registerProductAPI(productData)
        setLoading(false)
        if (response.status) {
            message.success('Producto registrado con éxito')
            fetchCategories()
        } else {
            message.error('Error al registrar el producto')
        }
    }

    const createCategory = async (categoryData: any) => {
        const response = await registerCategoryAPI(categoryData)
        if (response.status) {
            message.success('Categoria creada con éxito')
            onSuccess
        } else {
            message.error('Error al crear categoria')
        }
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

    useEffect(() => {
        fetchSellers()
        fetchCategories()
    }, [])

    return (
        <Modal
            title='Agregar Producto'
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
                        placeholder='Selecciona una marca'
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
                    name='id_Categoria'
                    label='Categoría'
                    rules={[{ required: true, message: 'Por favor seleccione una marca' }]}
                >
                    <Select
                        placeholder='Selecciona una categoría'
                        options={categories.map((category: any) => ({
                            value: category.id_Categoria,
                            label: category.categoria
                        }))}
                        showSearch
                        filterOption={(input, option: any) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
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
