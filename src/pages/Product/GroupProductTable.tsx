import { Table } from "antd";
import { getProductsInGroupAPI } from "../../api/group";
import useProducts from "../../hooks/useProducts";
import { useEffect, useState } from "react";
import { getCategoriesAPI } from "../../api/category";
import { getProductCategoryAPI } from "../../api/product";


const GroupProductTable = ( group: any) => {
    const columns = [
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
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
        },
        {
            title: 'Precio de venta',
            dataIndex: "precio",
            key: "precio"
        }
    ];

    const [products, setProduts] = useState([])

    useEffect(() => {
        const fetchProductInCategory = async () => {
            const productsRes = await getProductsInGroupAPI(group.group.id);
            console.log(productsRes)
            const parseProducts = await Promise.all( productsRes.map(async (product) => {
                const category = await getProductCategoryAPI(product.id_producto)
                return ({
                    producto: product.nombre_producto,
                    stockActual: 10,
                    categoria: category.categoria,
                    precio: product.precio
                })   
            }))
            setProduts(parseProducts)
        }
        fetchProductInCategory()
    }, [group.group.id])


    return (
        <div style={{margin: '1rem'}}>
            <Table
            columns={columns}
            dataSource={products}
            pagination={false}
            title={ () => <h2>{group.group.name}</h2>}
            />
        </div>
        

    )

}

export default GroupProductTable