import { Button, Table } from "antd";
import { getProductsInGroupAPI } from "../../api/group";
import useProducts from "../../hooks/useProducts";
import { useEffect, useState } from "react";
import { getCategoriesAPI } from "../../api/category";
import { getProductCategoryAPI } from "../../api/product";
import ProductInfoModal from "./ProductInfoModal";
import { InfoCircleOutlined } from '@ant-design/icons';


const GroupProductTable = ( {group, onAddVariant} ) => {
    const columns = [
        {
            title: '',
            dataIndex: 'infoButton',
            key: 'infoButton',
            width: '5%'
        },
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
            width: "40%"
        },
        {
            title: 'Stock actual',
            dataIndex: 'stockActual',
            key: 'stockActual',
            width: "20%"
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
            width: "20%"
        },
        {
            title: 'Precio de venta',
            dataIndex: "precio",
            key: "precio",
            width: "20%"
        }
    ];

    
    const [isModalVisible, setIsModalVisible] = useState<boolean> (false);
    const [selectedProduct, setSelectedProduct] = useState<any> (null);

    const showModal = (product: any) => {
        setSelectedProduct(product)
        setIsModalVisible(true)
    }
    const closeModal = () => { 
        setIsModalVisible(false)
        setSelectedProduct(null)
    }

    const [products, setProduts] = useState([])

    useEffect(() => {
        const fetchProductInCategory = async () => {
            const productsRes = await getProductsInGroupAPI(group.id);
            const parseProducts = await Promise.all( productsRes.map(async (product) => {
                const category = await getProductCategoryAPI(product.id_producto)
                return ({
                    infoButton: ( 
                        <Button type="primary"  onClick={() => showModal(product)}>
                            <InfoCircleOutlined />
                        </Button>
                    ),

                    producto: product.nombre_producto,
                    stockActual: product.stock || 0,
                    categoria: category.categoria,
                    precio: product.precio
                })   
            }))
            setProduts(parseProducts)
        }
        fetchProductInCategory()
    },[])
    

    return (
        <div style={{margin: '1rem'}}>
            <Table
            columns={columns}
            dataSource={products}
            pagination={false}
            title={ () => (
                <div className="flex justify-between items-center">
                    <h2>{group.name}</h2>
                    <Button type="primary" onClick={onAddVariant}>Agregar Variante</Button>
                </div>
            )}
            />
            {selectedProduct && (
                <ProductInfoModal
                    visible={isModalVisible}
                    onClose={closeModal}
                    product={selectedProduct}
                />
            )}
        </div>
        

    )

}

export default GroupProductTable