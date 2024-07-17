import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';

const ProductTable = ({ data }: any, refreshKey: any) => {
    interface ProductoData {
        key: string;
        producto: string;
        precioDeVenta: string;
        nombre: string;
        categorias: ICategoria[];
        caracteristicas: ICaracteristica[];
    }

    interface ICategoria {
        key: string;
        categoria: string;
    }

    interface ICaracteristica {
        key: string;
        caracteristica: string;
        valor: string;
    }

    const getUniqueCharacteristics = (data: ProductoData[]) => {
        const allCharacteristics = data.flatMap(item => item.caracteristicas.map(c => c.caracteristica));
        return Array.from(new Set(allCharacteristics))
    }

    const uniqueCharacteristics = getUniqueCharacteristics(data);

    const columns: ColumnsType<ProductoData> = [
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
            title: 'Precio de venta',
            dataIndex: 'precioDeVenta',
            key: 'precioDeVenta',
        },
        {
            title: 'Categorías',
            dataIndex: 'categorias',
            key: 'categorias',
            render: (categorias: ICategoria[]) => (
                <>
                    {categorias.map(categoria => (
                        categoria.categoria
                    ))}
                </>
            ),
        },
        ...uniqueCharacteristics.map(caracteristica => ({
            title: caracteristica,
            dataIndex: caracteristica.toLowerCase(),
            key: caracteristica.toLowerCase(),
            render: (_: any, record: ProductoData) => {
                const caract = record.caracteristicas.find(c => c.caracteristica === caracteristica);
                return caract ? caract.valor : '-';
            }
        })),
    ];

    useEffect(() => {
    }, [refreshKey])        
    

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            // title={() => <h1>Inventario</h1>}
        />
    );
};
export default ProductTable;
