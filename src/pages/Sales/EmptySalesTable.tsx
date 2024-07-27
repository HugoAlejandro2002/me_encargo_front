import { Button, InputNumber, Table } from "antd";
import { useEffect, useState } from "react";
import useEditableTable from "../../hooks/useEditableTable";

const EmptySalesTable = ({ products, onDeleteProduct, onUpdateTotalAmount }: { products: any[], onDeleteProduct: (key: any) => void, onUpdateTotalAmount: (amount: number) => void }) => {

    //const [handleValueChange] = useEditableTable(products) Ver como utilizarlo
    const [newProducts, setNewProducts] = useState(products.map(product => ({
        ...product,
        cantidad: product.cantidad || 1
    })));
    const handleValueChange = (key: any, field: string, value: any) => {
        const updatedProducts = newProducts.map(product =>
            product.key === key
                ? { ...product, [field]: value }
                : product
        );
        setNewProducts(updatedProducts);
    };

    // Calcula el total basándote en los valores actualizados
    const totalAmount = newProducts.reduce((acc, product) => {
        const cantidad = product.cantidad || 0;
        const precio = product.precio || 0;
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
                    defaultValue={1}
                    onChange={value => handleValueChange(record.key, 'cantidad', value)}
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
                    defaultValue={record.precio}
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
        }
    ];
    useEffect(() => {
        onUpdateTotalAmount(totalAmount)
        setNewProducts((prevProducts) => {
            // Mapea los productos con los valores actuales y mantiene los cambios en `cantidad`
            const productMap = new Map(prevProducts.map(p => [p.key, p]));
            const updatedProducts = products.map(product => ({
                ...product,
                cantidad: productMap.has(product.key) ? productMap.get(product.key).cantidad : product.cantidad || 1,
                precio: productMap.has(product.key) ? productMap.get(product.key).precio : product.precio || 0,
                utilidad: productMap.has(product.key) ? productMap.get(product.key).utilidad : product.utilidad || 0
            }));
            return updatedProducts;
        });
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