import { Modal, Button, Descriptions } from 'antd';
import RestockTable from './RestockTable';
import EntryProductTable from './EntryProductTable';
import SalesProductTable from './SalesProductTable';
import { useEffect, useState } from 'react';
import { deleteProductSalesAPI, updateProductSalesAPI } from '../../api/sales';
import { updateProductEntriesAPI, deleteProductEntriesAPI } from '../../api/entry';
import { updateProductStockAPI } from '../../api/product';


const ProductInfoModal = ({ visible, onClose, product }) => {

  const { nombre_producto, precio, fecha_de_ingreso, categoria, group, features } = product;

  const [products, setProducts] = useState([product]);
  const [entryData, setEntryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [restockData, setRestockData] = useState([]);
  useEffect(() => {
    setProducts([product]);
    setRestockData([{
      ...product,
      stock: product.producto_sucursal.reduce((acc, prodSuc) => acc + prodSuc.cantidad_por_sucursal, 0),
      incomingQuantity: 0,
      precio: product.precio || 0
    }]);
  }, [product]);
  const handleSave = async () => {
    try {
      const restockBodyData = restockData.map(({ incomingQuantity, precio, id_producto, deleted }) => ({
        precio,
        stock: incomingQuantity,
        productId: id_producto,
        sucursalId: 3,
        deleted
      }));

      const entryBodyData = entryData.map(({ id_ingreso, cantidad_ingreso, deleted }) => ({
        id_ingreso,
        cantidad_ingreso,
        deleted
      }));

      const salesBodyData = salesData.map(({ id_venta, cantidad, precio_unitario, deleted }) => ({
        id_venta,
        cantidad,
        precio_unitario,
        deleted
      }));

      // Update stock, entries and sales API calls
      const updatePromises = [
        updateProductStockAPI(restockBodyData.filter(item => !item.deleted)),
        updateProductEntriesAPI(entryBodyData.filter(item => !item.deleted)),
        updateProductSalesAPI(salesBodyData.filter(item => !item.deleted))
      ];

      // Delete entries and sales API calls
      const deletePromises = [
        deleteProductEntriesAPI(entryBodyData.filter(item => item.deleted)),
        deleteProductSalesAPI(salesBodyData.filter(item => item.deleted))
      ];

      await Promise.all([...updatePromises, ...deletePromises]);

      onClose();
      // onSaveSuccess();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <Modal
      title={product.nombre_producto}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>
      ]}
      centered
      width={800}
    >
      <Descriptions bordered layout="horizontal" column={2}>
        <Descriptions.Item label="Nombre">{nombre_producto}</Descriptions.Item>
        <Descriptions.Item label="Precio">{precio} Bs</Descriptions.Item>
        <Descriptions.Item label="Fecha de Ingreso">{new Date(fecha_de_ingreso).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Categoría">{categoria.categoria || categoria}</Descriptions.Item>
        <Descriptions.Item label="Grupo">{group.name}</Descriptions.Item>
        <Descriptions.Item label="Stock Total">{product.producto_sucursal.reduce((acc: number, prodSuc: any) => acc + prodSuc.cantidad_por_sucursal, 0)}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: '20px' }}>Características</h3>
      <Descriptions bordered layout="horizontal" column={2}>
        {features.map((feature, index) => (
          <Descriptions.Item key={index} label={feature.feature}>{feature.value}</Descriptions.Item>
        ))}
      </Descriptions>
      <RestockTable products={products} onSave={handleSave} setRestockData={setRestockData}  />
      <h3 style={{ marginTop: '20px' }}>Historial de Ingresos</h3>
      <EntryProductTable product={products} onSave={handleSave} setEntryData={setEntryData} />
      <h3 style={{ marginTop: '20px' }}>Historial de Ventas</h3>
      <SalesProductTable product={products} onSave={handleSave} setSalesData={setSalesData}/>
    </Modal>
  );
};

export default ProductInfoModal;
