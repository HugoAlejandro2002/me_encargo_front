import { Button, InputNumber, Table } from "antd";
import { useContext, useState } from "react";
import { updateProductStockAPI } from "../../api/product";
import { UserContext } from "../../context/userContext";
import { EditableCellInputNumber } from "../components/editableCell";


const RestockTable = ({ products, onSave }) => {
    const { user }: any = useContext(UserContext);
    const isAdmin = user?.role === 'admin';

    const [restockData, setRestockData] = useState(products.map(product => ({
        ...product,
        stock: product.producto_sucursal.reduce((acc: number, prodSuc: any) => acc + prodSuc.cantidad_por_sucursal, 0) || 0,
        incomingQuantity: 0,
        precio: product.precio || 0  // Initialize precio if it's not present
    })));
    const handleDataChange = (index, key, value) => {
        const newRestockData = [...restockData];
        newRestockData[index][key] = value;
        setRestockData(newRestockData);
    };
    const handleSave = async () => {
        try {
            const bodyData = restockData.map(({incomingQuantity, precio, stock, id_producto}) => ({
                precio, 
                stock: incomingQuantity,
                productId: id_producto,
                // TODO AGREGAR SECCION DE SUCURSAL
                sucursalId: 3
            }))
            await updateProductStockAPI(bodyData)
            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving restock data:', error);
        }
    };

    const columns = [
        {
            title: 'Nombre del Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            render: (text, record, index) => (
                <EditableCellInputNumber
                    isAdmin={isAdmin}
                    value={text}
                    min={0} 
                    onChange={(value) => handleDataChange(index, 'precio', value)}
                />
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Entrada',
            dataIndex: 'incomingQuantity',
            key: 'incomingQuantity',
            render: (text, record, index) => (
                <EditableCellInputNumber
                    isAdmin={isAdmin}
                    value={text}
                    min={0} 
                    onChange={(value) => handleDataChange(index, 'incomingQuantity', value)}
                />
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={restockData}
                pagination={false}
                rowKey="id_producto"
            />
            {isAdmin&& (
                <Button type="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                    Guardar y Enviar
                </Button>
            )}
        </div>
    );
}

export default RestockTable