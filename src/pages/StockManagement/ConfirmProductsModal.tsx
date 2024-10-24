import { Modal, Button, Descriptions, Table, Input, Popconfirm } from 'antd';
import { createProductsFromGroup, createVariant, getProductsFromGroup } from '../../services/createProducts';
import { updateProductStockAPI } from '../../api/product';
import { generateDeliveredProductsAPI } from '../../api/googleDrive';
import { useState } from 'react';


const ConfirmProductsModal = ({ visible, onClose, onSuccess, newVariants, newProducts, newStock }) => {

    const [newProductsList, setNewProductsList] = useState( () => {
        const tempProductList = []
        for(const product of newProducts){
        
            const {productData, combinations, selectedFeatures, features} = product
            const formatProduct = getProductsFromGroup(productData, combinations, selectedFeatures, features)
            for(const p of formatProduct){
                tempProductList.push({
                    nameAndFeatures: p.nombre_producto,
                    stock: p.cantidad_por_sucursal,
                    entrance: p.cantidad_por_sucursal,
                    precio: p.precio,
                    categoria: ''
                })
            }
    
        }
    
        const newVariantsList = newVariants.map(newVariant => {
            const {product} = newVariant
            const features = newVariant.featuresFilter.map(feature => feature.value)
            return {
                ...product,
                nameAndFeatures: `${product.nombre_producto} ${features.join(' ')}`
            }
        })
        return [...tempProductList, ...newVariantsList]
    })


    const handleDeleteNewProduct = (index) => {
        const updatedNewProducts = [...newProductsList];
        updatedNewProducts.splice(index, 1); // Remove the row at the given index
        setNewProductsList(updatedNewProducts);
    };

    const newProductsColumns = [
        { title: 'Producto', dataIndex: 'nameAndFeatures', key: 'nameAndFeatures' },
        { 
            title: 'Stock Nuevo', 
            dataIndex: 'stock', 
            key: 'stock',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={record.stock}
                    onChange={() => {}}
                />
            ), },
        { title: 'Precio', dataIndex: 'precio', key: 'precio' },
        { title: 'Categoría', dataIndex: 'categoria', key: 'categoria' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record, index) => (
                <Popconfirm
                    title="¿Estás seguro de eliminar este producto?"
                    onConfirm={() => handleDeleteNewProduct(index)}
                >
                    <Button type="link" danger>Eliminar</Button>
                </Popconfirm>
            ),
        },
    ];


    const [entranceProducts, setEntranceProducts] = useState(() => newStock.map(stock => {
        const { product } = stock;
        const features = product.features.map(feature => feature.value);
        return {
            nameAndFeatures: `${product.nombre_producto} ${features.join(' ')}`,
            stock: product.producto_sucursal[0].cantidad_por_sucursal,
            entrance: product.entrance || 0,  // Make sure entrance is initialized
            precio: product.precio,
            categoria: product.categoria
        };
    }));
    
    const handleEntranceChange = (value, index) => {
        const updatedEntranceProducts = [...entranceProducts];
        updatedEntranceProducts[index].entrance = value; // Update entrance for that row
        setEntranceProducts(updatedEntranceProducts);
    }; 
    const handleDeleteEntranceProduct = (index) => {
        const updatedEntranceProducts = [...entranceProducts];
        updatedEntranceProducts.splice(index, 1); // Remove the row at the given index
        setEntranceProducts(updatedEntranceProducts);
    };

    const entranceProductsColumns = [
        { title: 'Producto', dataIndex: 'nameAndFeatures', key: 'nameAndFeatures' },
        { title: 'Stock Total', dataIndex: 'stock', key: 'stock' },
        {
            title: 'Stock Nuevo',
            dataIndex: 'entrance',
            key: 'entrance',
            render: (text, record, index) => (
                <Input
                    type="number"
                    value={record.entrance}
                    onChange={e => handleEntranceChange(e.target.value, index)}
                />
            ),
        },
        { title: 'Precio', dataIndex: 'precio', key: 'precio' },
        { title: 'Categoría', dataIndex: 'categoria', key: 'categoria' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record, index) => (
                <Popconfirm
                    title="¿Estás seguro de eliminar este producto?"
                    onConfirm={() => handleDeleteEntranceProduct(index)}
                >
                    <Button type="link" danger>Eliminar</Button>
                </Popconfirm>
            ),
        },
    ];


    const saveProducts = async () => {

        for(const variant of newVariants){
            await createVariant(variant)
        }

        for(const product of newProducts){
            const {productData, combinations, selectedFeatures, features} = product
            await createProductsFromGroup(productData, combinations, selectedFeatures, features)
        }

        const newStockList = newStock.map(stock => stock.newStock)
        
        await updateProductStockAPI(newStockList)

        const productsPDF = [...entranceProducts.map(product => 
            ({
                producto: product.nameAndFeatures,
                unitario: product.precio,
                cantidad: product.entrance,
                total: product.precio*product.stock
            })),
            ...newP.map(product => ({
                producto: product.nameAndFeatures,
                unitario: product.precio,
                cantidad: product.entrance,
                total: product.precio*product.stock
            }))
        ]

        await generateDeliveredProductsAPI(productsPDF)
        
        onSuccess()
    }

    return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="back" onClick={saveProducts}>
            Guardar
        </Button>
      ]}
      centered
      width={800}
    >

        <h2 style={{ margin: '20px' }}>Productos Nuevos</h2>
        <Table
            columns={newProductsColumns}
            dataSource={newProductsList}
            pagination={false}
        />

        <h2 style={{ margin: '20px' }}>Productos Entrantes</h2>

        <Table
            columns={entranceProductsColumns}
            dataSource={entranceProducts}
            pagination={false}
        />
    </Modal>
  );
};

export default ConfirmProductsModal;
