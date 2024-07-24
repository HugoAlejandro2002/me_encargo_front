import { useState, useEffect } from "react";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../api/product";

const useProducts = () => {
    const [starterData, setStarterData] = useState<any[]>([]);

    const fetchProductFeatures = async (productId: any) => {
        try {
            const res = await getProductFeaturesAPI(productId);
            return res;
        } catch (error) {
            console.log(error, `Error al obtener las características con idProducto ${productId}`);
            return [];
        }
    };

    const fetchProductCategory = async (productId: any) => {
        try {
            const res = await getProductCategoryAPI(productId);
            return res;
        } catch (error) {
            console.log(error, `Error al obtener la categoría con idProducto ${productId}`);
            return { categoria: '-' };
        }
    };

    const mapApiDataToProductoData = async (apiData: any) => {
        const productDataPromises = apiData.map(async (item: any) => {
            const category = await fetchProductCategory(item.id_producto);
            // const features = await fetchProductFeatures(item.id_producto);

            return {
                key: item.id_producto,
                producto: item.nombre_producto,
                precio: item.precio,
                categoria: category.categoria,
                id_vendedor: item.id_vendedor,
            };
        });
        return Promise.all(productDataPromises);
    };

    const fetchProducts = async () => {
        const apiData = await getProductsAPI();
        const productData = await mapApiDataToProductoData(apiData);
        setStarterData(productData);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { starterData, fetchProducts };
};

export default useProducts;
