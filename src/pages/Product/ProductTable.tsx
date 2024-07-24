import { Table } from 'antd';
import { useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';

const ProductTable = (refreshKey: any) => {
    const { starterData, fetchProducts } = useProducts()
    const [data, setData] = useState<any>([])
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
        },
        {
            title: 'Stock actual',
            dataIndex: 'stockActual',
            key: 'stockActual',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
        },
    ];

    useEffect(() => {
        const getNewData = async () => {
            const newData = await fetchProducts()
            setData(newData)
        }

        if (refreshKey.refreshKey == 0) {
            setData(starterData)
        } else {
            getNewData()
        }
    }, [refreshKey])

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
        // title={() => <h1>Inventario</h1>}
        />
    );
};
export default ProductTable;
