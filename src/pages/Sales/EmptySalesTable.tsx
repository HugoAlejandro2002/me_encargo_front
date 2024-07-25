import { Button, InputNumber, Table } from "antd";
import { useEffect } from "react";
import useEditableTable from "../../hooks/useEditableTable";

const EmptySalesTable = ({ products, onDeleteProduct }: { products: any[], onDeleteProduct: (key: any) => void }) => {

    const [handleValueChange] = useEditableTable(products)

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
            render: (_: any, record: any) => (
                <InputNumber
                    min={0}
                    value={record.precio}
                    onChange={value => handleValueChange(record.key, 'precio', value)}
                />
            )
        },
        {
            title: 'Utilidad',
            dataIndex: 'utilidad',
            key: 'utilidad',
            render: () => (
                <InputNumber
                    min={0}
                    value={0}
                />
            )
        },
        {
            title: 'Acción',
            key: 'action',
            render: (_: any, record: any) => (
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