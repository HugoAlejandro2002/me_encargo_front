import { Menu, Table } from 'antd';

import { useContext, useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';
import useSellers from '../../hooks/useSellers';
import { UserContext } from '../../context/userContext';
const ProductTable = ({ data, onSelectProduct, refreshKey }: any) => {
    const { user }: any = useContext(UserContext);
    const isSeller = user?.role === 'seller';
    
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
        },
        {
            title: 'Stock actual',
            dataIndex: 'stockActual',
            key: 'stockActual',
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
    ]

    const { fetchProducts } = useProducts()
    const [localData, setLocalData] = useState<any>([])
    const [selectedSeller, setSelectedSeller] = useState<any>({ key: 'all' })
    const { sellers } = useSellers()

    useEffect(() => {
        const getNewData = async () => {
            const newData = await fetchProducts()
            setLocalData(newData)
        }
        getNewData()
    }, [refreshKey])

    const menuItems = [
        { key: 'all', label: 'Todo' }, // Opción para mostrar todos los productos
        ...sellers?.map((seller: any) => ({
            key: seller.id_vendedor,
            label: `${seller.nombre} ${seller.apellido}`,
        })) || [],
    ];
    const filteredData = selectedSeller.key == 'all'
        ? data
        : data.filter((product: any) => product.id_vendedor == selectedSeller.key);

    return (
        <div className='flex'>
            {!isSeller && (
                <Menu
                    onClick={(key) => setSelectedSeller(key)}
                    selectedKeys={[selectedSeller]}
                    mode="vertical"
                    items={menuItems}
                />
            )}
            <Table
                className='flex-1 '
                columns={columns}
                dataSource={filteredData}
                pagination={false}
                onRow={(record) => ({
                    onClick: () => onSelectProduct(record),
                })}
            />
        </div>
    );
};
export default ProductTable;
