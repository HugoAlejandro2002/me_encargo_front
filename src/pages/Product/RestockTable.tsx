import { Button, InputNumber, Table } from "antd";
import { useState } from "react";


const RestockTable = ({products, onSave}) => {
    const [restockData, setRestockData] = useState(products.map(product => ({
        ...product,
        stock: product.stock || 0,
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
            console.log("Saving", restockData)

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
                <InputNumber
                    min={0}
                    value={text}
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
                <InputNumber
                    value={text}
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
            <Button type="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                Guardar y Enviar
            </Button>
        </div>
    );
}

export default RestockTable