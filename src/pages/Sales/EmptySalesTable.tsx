import { Button, InputNumber, Table } from "antd";
import { useEffect, useState } from "react";

const EmptySalesTable = ({ products, onDeleteProduct, onUpdateTotalAmount, handleValueChange}: any) => {

    //const [handleValueChange] = useEditableTable(products) Ver como utilizarlo
    const [newProducts, setNewProducts] = useState<any>();

    // Calcula el total basándote en los valores actualizados
    const totalAmount = products.reduce((acc: any, product: any) => {
        const cantidad = product.cantidad || 0;
        const precio = product.precio_unitario || 0;
        return acc + (precio* cantidad);
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
        // setNewProducts((prevProducts) => {
        //     // Mapea los productos con los valores actuales y mantiene los cambios en `cantidad`
        //     const productMap = new Map(prevProducts.map(p => [p.key, p]));
        //     const updatedProducts = products.map(product => ({
        //         ...product,
        //         cantidad: productMap.has(product.key) ? productMap.get(product.key).cantidad : product.cantidad || 1,
        //         precio: productMap.has(product.key) ? productMap.get(product.key).precio : product.precio || 0,
        //         utilidad: productMap.has(product.key) ? productMap.get(product.key).utilidad : product.utilidad || 0
        //     }));
        //     return updatedProducts;
        // });
    }, [products, onUpdateTotalAmount]);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={products}
                pagination={false}
                footer={() => (
                    <div style={{ textAlign: 'right' }}>
                        <strong>Monto Total:</strong> Bs.{totalAmount.toFixed(2)}
                    </div>
                )}
            />
        </div>
    );
}

export default EmptySalesTable;