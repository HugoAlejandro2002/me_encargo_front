import { useState, useEffect } from "react";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../api/product";

const useProducts = () => {
    const [data, setData] = useState<any[]>([]);

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
                stockActual: item.producto_sucursal.reduce((acc: number, prodSuc: any) => acc + prodSuc.cantidad_por_sucursal, 0),
                categoria: category.categoria,
                id_vendedor: item.id_vendedor,
            };
        });
        return Promise.all(productDataPromises);
    };

    const fetchProducts = async () => {
        const apiData = await getProductsAPI();
        const productData = await mapApiDataToProductoData(apiData);
        setData(productData);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { data, fetchProducts };
};

export default useProducts;
