import { Table } from 'antd';
import { useEffect } from 'react';

const ProductTable = ({ data }: any, refreshKey: any) => {

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
            title: 'Precio de venta',
            dataIndex: 'precioDeVenta',
            key: 'precioDeVenta',
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
        },
    ];

    useEffect(() => {
        console.log('nueva data', data)
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
