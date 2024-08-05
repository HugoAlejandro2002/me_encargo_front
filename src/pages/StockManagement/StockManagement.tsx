import React, { useEffect, useState } from 'react';
import SellerList from './SellerList';
import ProductTable from './ProductTable';
import { getProductsAPI, updateProductStockAPI } from '../../api/product'; // Assuming this is where you get both sellers and products
import { getSellersAPI } from '../../api/seller';
import { Button, Input } from 'antd';

const StockManagement = () => {
    const [sellers, setSellers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [stockData, setStockData] = useState<any[]>([]);
    const [ingresoData, setIngresoData] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellersResponse = await getSellersAPI();
                sellersResponse.unshift({id_vendedor: null, name: "Todos"})
                setSellers(sellersResponse);

                const productsResponse = await getProductsAPI()// Fetch all products initially
                for(const product of productsResponse){
                    product.categoria = product.categoria.categoria
                }
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

        setFilteredProducts(updatedProducts);
        setSelectedSeller(null)
        setIngresoData({});
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
                        ingresoData={ingresoData}
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
