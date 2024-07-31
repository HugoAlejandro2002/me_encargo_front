import { Button, InputNumber, Table } from "antd";
import { useEffect } from "react";

const EmptySalesTable = ({ products, onDeleteProduct, onUpdateTotalAmount, handleValueChange }: any) => {

    const totalAmount = products.reduce((acc: any, product: any) => {
        const cantidad = product.cantidad || 0;
        const precio = product.precio_unitario || 0;
        return acc + (precio * cantidad);
    }, 0);
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
            render: (_: any, record: any) => (
                <InputNumber
                    min={1}
                    value={record.cantidad}
                    onChange={value => handleValueChange(record.key, 'cantidad', value)}
                />
            ),
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'precio_unitario',
            key: 'precio_unitario',
            render: (_: any, record: any) => (
                <InputNumber
                    min={0}
                    value={record.precio_unitario}
                    onChange={value => handleValueChange(record.key, 'precio_unitario', value)}
                />
            )
        },
        {
            title: 'Utilidad',
            dataIndex: 'utilidad',
            key: 'utilidad',
            render: (_: any, record: any) => (
                <InputNumber
                    min={0}
                    value={record.utilidad}
                    onChange={value => handleValueChange(record.key, 'utilidad', value)}
                    defaultValue={0}
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
        },
    ];
    useEffect(() => {
        onUpdateTotalAmount(totalAmount)
    }, [products, onUpdateTotalAmount]);

    return (
        <div>
            <div style={{ textAlign: 'right' }}>
                <strong>Monto Total:</strong> Bs.{totalAmount.toFixed(2)}
            </div>
            <Table
                columns={columns}
                dataSource={products}
                pagination={false}
            // footer={() => (
            //     <div style={{ textAlign: 'right' }}>
            //         <strong>Monto Total:</strong> Bs.{totalAmount.toFixed(2)}
            //     </div>
            // )}
            />
        </div>
    );
}

export default EmptySalesTable;