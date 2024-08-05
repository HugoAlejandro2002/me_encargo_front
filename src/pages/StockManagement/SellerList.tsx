import React from 'react';
import { List, Button } from 'antd';

const SellerList = ({ sellers, onSelectSeller }: any) => {
    return (
        <List
            bordered
            dataSource={sellers}
            renderItem={(seller: any) => (
                <List.Item>
                    <Button
                        type="link"
                        onClick={() => onSelectSeller(seller.id_vendedor)}
                    >
                        {seller.marca} - {seller.nombre} {seller.apellido}
                    </Button>
                </List.Item>
            )}
        />
    );
};

export default SellerList;
