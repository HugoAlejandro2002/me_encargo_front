import { Table } from 'antd';

import { useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';
const ProductTable = ({ data, onSelectProduct, refreshKey }: any) => {

    const { fetchProducts } = useProducts()
    const [localData, setLocalData] = useState<any>([])
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
            setLocalData(newData)
        }
        getNewData()
    }, [refreshKey])

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            onRow={(record) => ({
                onClick: () => onSelectProduct(record),
            })}
        // title={() => <h1>Inventario</h1>}
        />
    );
};
export default ProductTable;
