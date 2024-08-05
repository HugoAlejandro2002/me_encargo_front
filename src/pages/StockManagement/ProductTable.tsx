import React from 'react';
import { Table } from 'antd';

const ProductTable = ({ data, onSelectProduct, columns }: any) => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            onRow={(record) => ({
                onClick: () => onSelectProduct(record),
            })}
            rowClassName={(record) => record.stockActual > 0 ? 'highlight-row' : ''}
        />
    );
};

export default ProductTable;
