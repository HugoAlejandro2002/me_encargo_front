import { useState, useEffect } from "react";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../api/product";

const useProducts = () => {
    const [data, setData] = useState<any[]>([]);
    
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

    const getCombinations = (features: any) => {
        if (features.length === 0) return [[]];
        const [firstFeature, ...restFeatures] = features;
        const restCombinations = getCombinations(restFeatures);

        return firstFeature.values.flatMap((value: any) =>
            restCombinations.map((combination: any) => [{ feature: firstFeature.feature, value }, ...combination])
        );
    };

    const mapApiDataToProductoData = (apiData: any) => {
        return apiData.flatMap(async (item: any) => {
            const category = await fetchProductCategory(item.id_producto);
            const features = await fetchProductFeatures(item.id_producto);
            
            const featureCombinations = getCombinations(features);

            if (featureCombinations.length === 0) {
                return [{
                    key: item.id_producto.toString(),
                    producto: item.nombre_producto,
                    stockActual: 4,
                    precioDeVenta: item.precio,
                    nombre: item.nombre_producto,
                    categoria: category.categoria,
                    id_vendedor: item.id_vendedor,
                }];
            }

            return featureCombinations.map((combination: any) => ({
                key: `${item.id_producto}-${combination.map((c: any) => c.value).join('-')}`,
                producto: `${item.nombre_producto} ${combination.map((item: any) => `${item.value}`).join(' ')}`,
                nombre: item.nombre_producto,
                categoria: category.categoria,
                id_vendedor: item.id_vendedor,
            }));
        });
    };

    const fetchProducts = async () => {
        const apiData = await getProductsAPI();
        const productDataPromise = mapApiDataToProductoData(apiData);
        const productData = await Promise.all(productDataPromise);
        setData(productData.flat());
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { data, fetchProducts };
};

export default useProducts;