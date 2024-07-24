import { Table } from 'antd';
import { useEffect } from 'react';

const ProductTable = ({ data, onSelectProduct }: { data: any[], onSelectProduct: (product: any) => void }) => {

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
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
        },
    ];

    useEffect(() => {
        console.log('nueva data', data)
    }, [])

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
