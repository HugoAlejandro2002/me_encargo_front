import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ProductoData {
    key: string;
    producto: string;
    stockActual: number;
    precioDeVenta: string;
    color: string;
    medida: string;
    caja: number;
    nombre: string;
    categorias: ICategoria[]; // Cambio en la estructura para incluir categorías
    caracteristicas: ICaracteristica[]; // Cambio en la estructura para incluir características
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

const getUniqueCharacteristics = (data: ProductoData[]): string[] => {
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
                    <Tag key={categoria.key}>{categoria.categoria}</Tag>
                ))}
            </>
        ),
    },
    {
        title: 'Características',
        dataIndex: 'caracteristicas',
        key: 'caracteristicas',
        render: (caracteristicas: ICaracteristica[]) => (
            <>
                {caracteristicas.map(caracteristica => (
                    <Tag key={caracteristica.key}>
                        {caracteristica.caracteristica}: {caracteristica.valor}
                    </Tag>
                ))}
            </>
        ),
    },
];

const data: ProductoData[] = [
    {
        key: '1',
        producto: 'Anillo Víbora Negro',
        stockActual: 4,
        precioDeVenta: 'Bs12,50',
        color: 'Negro',
        medida: 'Víbora',
        caja: 1,
        nombre: 'Anillo',
        categorias: [{ key: '1', categoria: 'Joyas' }],
        caracteristicas: [
            { key: '1', caracteristica: 'Material', valor: 'Plata' },
            { key: '2', caracteristica: 'Tamaño', valor: 'Pequeño' },
        ],
    },
    {
        key: '2',
        producto: 'Anillo Víbora Plateado',
        stockActual: 3,
        precioDeVenta: 'Bs12,50',
        color: 'Plateado',
        medida: 'Víbora',
        caja: 1,
        nombre: 'Anillo',
        categorias: [{ key: '2', categoria: 'Joyas' }],
        caracteristicas: [
            { key: '3', caracteristica: 'Material', valor: 'Plata' },
            { key: '4', caracteristica: 'Material', valor: 'Plata' },
            { key: '5', caracteristica: 'Material', valor: 'Plata' },
            { key: '6', caracteristica: 'Material', valor: 'Plata' },
            { key: '7', caracteristica: 'Material', valor: 'Plata' },
            { key: '8', caracteristica: 'Tamaño', valor: 'Grande' },
        ],
    },
    // Agrega el resto de los datos aquí
];

const ProductTable: React.FC = () => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            title={() => <h2>Products Page</h2>}
        />
    );
};
export default ProductTable;
