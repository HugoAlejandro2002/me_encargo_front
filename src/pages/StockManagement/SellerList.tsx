import React from 'react';
import { List, Button } from 'antd';

const SellerList = ({ sellers, onSelectSeller }: any) => {

    for(const seller of sellers){
        if(seller.id_vendedor)
            seller.name = `${seller.marca} - ${seller.nombre} ${seller.apellido}`
    }

    return (
        <div style={{marginTop: 30}}>

            <List
                bordered
                dataSource={sellers}
                renderItem={(seller: any) => (
                    <List.Item>
                        <Button
                            type="link"
                            onClick={() => onSelectSeller(seller.id_vendedor)}
                        >
                            {seller.name}   
                        </Button>
                    </List.Item>
                )}
            />
        </div>
        
    );
};

export default SellerList;
