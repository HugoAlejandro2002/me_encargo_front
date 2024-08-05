import React from 'react';
import { Table } from 'antd';

const ProductTable = ({ data, onSelectProduct, columns, ingresoData }: any) => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            onRow={(record) => ({
                onClick: () => onSelectProduct(record),
            })}
            rowClassName={(record) => {
                const ingreso = ingresoData[record.id_producto] || 0;
                return ingreso !== 0 ? 'highlight-row' : '';
            }}
        />
    );
};

export default ProductTable;
