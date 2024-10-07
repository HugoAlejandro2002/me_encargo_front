import React from 'react';
import { Modal, Button, Descriptions } from 'antd';
import RestockTable from './RestockTable';


const ProductInfoModal = ({ visible, onClose, product }) => {

  // console.log(product)
  const { nombre_producto, precio, fecha_de_ingreso, imagen, categoria, group, features } = product;

  const products = [product]

  const handleSave = () => {
    onClose()
  }
  return (
    <Modal
      title={product.nombre_producto}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
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
      <RestockTable products={products} onSave={handleSave} />
      <h3 style={{ marginTop: '20px' }}>Historial de Ingresos</h3>
      <h3 style={{ marginTop: '20px' }}>Historial de Ventas</h3>
    </Modal>
  );
};

export default ProductInfoModal;
