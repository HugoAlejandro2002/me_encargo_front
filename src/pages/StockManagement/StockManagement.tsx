import React, { useEffect, useState } from 'react';
import SellerList from './SellerList';
import ProductTable from './ProductTable';
import { getProductsAPI } from '../../api/product'; // Assuming this is where you get both sellers and products
import { getSellersAPI } from '../../api/seller';
import { Button } from 'antd';

const StockManagement = () => {
    const [sellers, setSellers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [stockData, setStockData] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellersResponse = await getSellersAPI();
                setSellers(sellersResponse);

                const productsResponse = await getProductsAPI(); // Fetch all products initially
                setProducts(productsResponse);
                setStockData(productsResponse); // Initialize stock data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSeller !== null) {
            const filterProducts = products.filter(
                (product) => product.id_vendedor === selectedSeller
            );
            setFilteredProducts(filterProducts);
        } else {
            setFilteredProducts(products);
        }
    }, [selectedSeller, products]);

    const handleSelectSeller = (sellerId: number) => {
        setSelectedSeller(sellerId);
    };

    const handleStockUpdate = () => {
        // Update stock values here
        const updatedProducts = filteredProducts.map(product => {
            const updatedStock = stockData.find(item => item.id_producto === product.id_producto);
            return {
                ...product,
                producto_sucursal: updatedStock ? updatedStock.producto_sucursal : product.producto_sucursal,
            };
        });
        setFilteredProducts(updatedProducts);
    };

    const columns = [
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
                producto_sucursal.reduce((acc: number, cur: any) => acc + cur.cantidad_por_sucursal, 0),
            // Highlight row if stock is non-zero
            className: (record: any) => {
                const totalStock = record.producto_sucursal.reduce(
                    (acc: number, cur: any) => acc + cur.cantidad_por_sucursal, 0
                );
                return totalStock > 0 ? 'highlight-row' : '';
            }
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Categoría',
            dataIndex: 'id_categoria',
            key: 'id_categoria',
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '30%' }}>
                    <h2>Lista de Vendedores</h2>
                    <SellerList
                        sellers={sellers}
                        onSelectSeller={handleSelectSeller}
                    />
                </div>
                <div style={{ width: '70%' }}>
                    <h2>Productos</h2>
                    <ProductTable
                        data={filteredProducts}
                        onSelectProduct={(product: any) => console.log(product)}
                        columns={columns}
                    />
                    <Button 
                        style={{ marginTop: '20px' }}
                        onClick={handleStockUpdate}>
                        Actualizar Stock
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StockManagement;
