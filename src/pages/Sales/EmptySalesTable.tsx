import { Button, InputNumber, Table } from "antd";
import { useEffect, useState } from "react";

const EmptySalesTable = ({ products, onDeleteProduct, handleValueChange }: any) => {

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
                    min={0}
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