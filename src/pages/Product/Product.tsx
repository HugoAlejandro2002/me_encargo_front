import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { getProductsAPI } from "../../api/product";

const Product = () => {
    const [data, setData] = useState<any>([]);
    const mapApiDataToProductoData = (apiData: any) => {
        return apiData.map((item: any) => ({
            key: item.id_Producto.toString(),
            producto: item.nombre_producto,
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
    }, []);

    return (
        <ProductTable data={data} />
    );
};

export default Product;
