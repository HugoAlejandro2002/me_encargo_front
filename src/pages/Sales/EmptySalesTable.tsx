import { Button, InputNumber, Table } from "antd";
import { useEffect } from "react";

const EmptySalesTable = ({ products, onDeleteProduct }: { products: any[], onDeleteProduct: (key: any) => void }) => {
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
            render: () => (
                <InputNumber
                    min={1}
                    value={1}
                />
            ),
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Utilidad',
            dataIndex: 'utilidad',
            key: 'utilidad',
        },
        {
            title: 'Acción',
            key: 'action',
            render: (text: any, record: any) => (
                <Button type="link" onClick={() => onDeleteProduct(record.key)}>
                    Eliminar
                </Button>
            ),
        }
    ];
    useEffect(() => {
    
    }, [products]);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={products}
                pagination={false}
            />
        </div>
    );
}

export default EmptySalesTable;