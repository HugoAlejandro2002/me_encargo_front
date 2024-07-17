import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { getProductsAPI } from "../../api/product";
import Button from "antd/es/button";
import ProductFormModal from "./ProductFormModal";

const Product = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [data, setData] = useState<any>([]);

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleSuccess = () => {
        setIsModalVisible(false)
        setRefreshKey(prevKey => prevKey + 1)
    }

    const mapApiDataToProductoData = (apiData: any) => {
        return apiData.map((item: any) => ({
            key: item.id_Producto.toString(),
            producto: item.nombre_producto,
            stockActual: 4,
            precioDeVenta: item.precio,
            nombre: item.nombre_producto,
            categorias: item.id_Categoria ? [{ key: item.id_Categoria.toString(), categoria: `Categoria ${item.id_Categoria}` }] : [],
            caracteristicas: item.id_Caracteristicas ? [{ key: item.id_Caracteristicas.toString(), caracteristica: `Caracteristica ${item.id_Caracteristicas}`, valor: 'Valor' }] : [],
        }));
    }

    async function fetchProducts() {
        const apiData = await getProductsAPI();
        const productData = mapApiDataToProductoData(apiData);
        setData(productData);
    }

    useEffect(() => {
        fetchProducts();
    }, [refreshKey])

    return (
        <>
            <div>
                <h1 className="text-red">Productos</h1>
                <Button onClick={showModal} type='primary'>Agregar Producto</Button>
            </div>
            <ProductTable data={data} key={refreshKey} />
            <ProductFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            >

            </ProductFormModal>
        </>
    );
};

export default Product;
