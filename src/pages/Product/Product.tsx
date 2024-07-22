import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../../api/product";
import Button from "antd/es/button";
import ProductFormModal from "./ProductFormModal";

const Product = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [data, setData] = useState<any>([])

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

    const getCombinations = (features: any) => {
        if (features.length === 0) return [[]]
        const [firstFeature, ...restFeatures] = features
        const restCombinations = getCombinations(restFeatures)

        return firstFeature.values.flatMap((value: any) =>
            restCombinations.map((combination: any) => [{ feature: firstFeature.feature, value }, ...combination])
        )
    }

    async function fetchProducts() {
        const apiData = await getProductsAPI()
        console.log('product api data', apiData)
        const productDataPromise = mapApiDataToProductoData(apiData)
        const productData = await Promise.all(productDataPromise)
        setData(productData.flat())
    }

    const mapApiDataToProductoData = (apiData: any) => {
        return apiData.flatMap(async (item: any) => {
            const category = await fetchProductCategory(item.id_producto)
            const features = await fetchProductFeatures(item.id_producto)
            console.log('apiData', apiData)
            console.log('id_product', item)
            console.log('categorias', category)
            console.log('features', features)
            
            const featureCombinations = getCombinations(features)
            console.log('featureCombinations', featureCombinations)

            if (featureCombinations.length === 0) {
                return [{
                    key: item.id_producto.toString(),
                    producto: item.nombre_producto,
                    stockActual: 4,
                    precioDeVenta: item.precio,
                    nombre: item.nombre_producto,
                    categoria: category.categoria,
                }]
            }

            return featureCombinations.map((combination: any) => ({
                key: `${item.id_producto}-${combination.map((c: any) => c.value).join('-')}`,
                producto: `${item.nombre_producto} ${combination.map((item: any) => `${item.value}`).join(' ')}`,
                stockActual: 4,
                precioDeVenta: item.precio,
                nombre: item.nombre_producto,
                categoria: category.categoria,
            }))
        })
    }

    const fetchProductFeatures = async (productId: any) => {
        try {
            const res = await getProductFeaturesAPI(productId)
            console.log(res, `este mi res de feautre con ${productId}`)
            return res
        } catch (error) {
            console.log(error, `Error al obtener las características con idProducto ${productId}`)
            return []
        }
    }

    const fetchProductCategory = async (productId: any) => {
        try {
            const res = await getProductCategoryAPI(productId)
            return res
        } catch (error) {
            console.log(error, `Error al obtener la categoría con idProducto ${productId}`)
            return { categoria: '-' }
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [refreshKey])

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Button onClick={showModal} type='primary'>Agregar Producto</Button>
            </div>
            <ProductTable data={data} key={refreshKey} />
            <ProductFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Product;
