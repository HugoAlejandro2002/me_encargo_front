import React, { useEffect, useState } from 'react';
import { Button, Input, Table } from 'antd';
import { getSellersAPI } from '../../api/seller';
import { getCategoriesAPI } from '../../api/category';
import { getGroupsAPI } from '../../api/group';
import { getProductsAPI, updateProductStockAPI } from '../../api/product';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

const ProductTable = ({ groupList, groupCriteria, showModal, showVariantModal, products, handleUpdate}: any) => {

    const [ingresoData, setIngresoData] = useState<{ [key: number]: number }>({});
    

    for(const product of products){
        product.categoria = product.categoria.categoria || "Sin categoria"
        product.infoButton = (
            <Button type="primary" onClick={() => showModal(product)}>
                <InfoCircleOutlined />
            </Button>
        )
        product.addVariant = (
            <Button type='primary' onClick={() => showVariantModal(product)}>
                <PlusOutlined />
            </Button>
        )
    }
        

    const handleIngresoChange = (productId: number, value: number) => {
        setIngresoData((prev) => ({ ...prev, [productId]: value }));
    };
    
    const handleStockUpdate = async () => {

        const updatedProducts = products
        
        const newStock = [] as any[];
        for(const product of updatedProducts){
            if(product.producto_sucursal[0]){
                // TODO Change when there will be more than one sucursal
                product.producto_sucursal[0].cantidad_por_sucursal += ingresoData[product.id_producto] || 0
                if(ingresoData[product.id_producto])
                    newStock.push({
                        productId: product.id_producto,
                        sucursalId: 3,
                        stock: ingresoData[product.id_producto]
                    })
            }
        }

        
        await updateProductStockAPI(newStock)

        handleUpdate()

        setIngresoData({});
    };

    
    const columns = [
        {
            title: "",
            dataIndex: "infoButton",
            key: "infoButton",
            width: "5%"
        },
        {
            title: "",
            dataIndex: "addVariant",
            key: "addVariant",
            width: "5%"  
        },
        {
            title: 'Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
        },
        {
            title: 'Stock actual',
            dataIndex: 'producto_sucursal',
            key: 'producto_sucursal',
            render: (producto_sucursal: any) =>
                producto_sucursal.reduce((acc: number, cur: any) => acc + cur.cantidad_por_sucursal, 0)
        },
        {
            title: 'Ingreso/Entrada',
            dataIndex: 'ingreso',
            key: 'ingreso',
            render: (_: any, record: any) => (
                <Input
                    type="number"
                    value={ingresoData[record.id_producto] || ''}
                    onChange={(e) =>
                        handleIngresoChange(record.id_producto, parseInt(e.target.value, 10) || 0)
                    }
                />
            ),
            width: "10%"
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
        },
    ];

    return (
        <>
            {
                groupList.map((group: any) => (
                    <div>
                        <h2 style={{textAlign: "left", marginTop: 30}}>{group.nombre || group.categoria || group.name}</h2>
                        <div style={{marginTop: 30}}>
                            <Table
                                columns={columns}
                                dataSource={groupCriteria(group)}
                                pagination={false}
                                rowClassName={(record) => {
                                    const ingreso = ingresoData[record.id_producto] || 0;
                                    return ingreso !== 0 ? 'highlight-row' : '';
                                }}
                                
                                
                            />
                        </div>
                    </div>
                ))
            }
            <Button 
                style={{ marginTop: '20px' }}
                onClick={handleStockUpdate}>
                Actualizar Stock
            </Button>
        </>
        
    )
};

export default ProductTable;
