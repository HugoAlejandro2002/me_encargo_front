import { Button, Form, Input, Modal, Select, message } from "antd"
import { useEffect, useState } from "react"
import { registerProductAPI } from "../../api/product"
import { getSellersAPI } from "../../api/seller"

const ProductFormModal = ({ visible, onCancel, onSuccess }: any) => {
    const [loading, setLoading] = useState(false)
    const [sellers, setSellers] = useState([])

    const handleFinish = async (productData: any) => {
        setLoading(true)
        productData.imagen = ''
        productData.id_Categoria = 100
        productData.id_Caracteristica = 1
        const response = await registerProductAPI(productData)
        setLoading(false)
        if (response.status) {
            message.success('Producto registrado con éxito')
            onSuccess()
        } else {
            message.error('Error al registrar el producto')
        }
    }

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await getSellersAPI()
                setSellers(response)
            } catch (error) {
                message.error('Error al obtener los vendedores')
            }
        }
        fetchSellers()
    })

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
                    <Select placeholder='Selecciona una marca' loading={loading}>
                        {sellers.map((seller: any) => (
                            <Select.Option key={seller.id_Vendedor} value={seller.id_Vendedor}>
                                {seller.marca}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Registrar Producto
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ProductFormModal