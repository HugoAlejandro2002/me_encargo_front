import React, { useEffect, useState } from 'react';
import { List, Button } from 'antd';
import { getSellersAPI } from '../../api/seller';
import { getGroupsAPI } from '../../api/group';
import { getCategoriesAPI } from '../../api/category';

const SellerList = ({ filterSelected, onSelectSeller, prevKey }: any) => {

    const [groups, setGroups] = useState<any[]>([])
    const [sellers, setSellers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([])
    const [filterList, setFilterList] = useState<any[]>([])
    const [idKey, setIdKey] = useState("id_vendedor")

    const fetchData = async () => {
        const sellersResponse = await getSellersAPI();
        sellersResponse.unshift({id_vendedor: null, name: "Todos"})
        setSellers(sellersResponse);

        const groupsResponse = await getGroupsAPI()
        setGroups(groupsResponse)

        const categoriesResponse = await getCategoriesAPI()
        for(const category of categoriesResponse)
            category.name = category.categoria
        setCategories(categoriesResponse)

        setFilterList(sellersResponse)
    }

    useEffect( () => {
        fetchData()
    }, [prevKey])


    useEffect( () => {
        if(filterSelected == 0){
            setIdKey("id_vendedor")
            setFilterList(sellers)
        }
        else if(filterSelected == 1){
            setIdKey("id_categoria")
            setFilterList(categories)
        }
        else{
            setIdKey("id")
            setFilterList(groups)
        }
    }, [filterSelected])

    for(const seller of sellers){
        if(seller.id_vendedor)
            seller.name = `${seller.marca} - ${seller.nombre} ${seller.apellido}`
    }


    return (
        <div style={{marginTop: 30}}>

            <List
                bordered
                dataSource={filterList}
                renderItem={(item: any) => (
                    <List.Item>
                        <Button
                            type="link"
                            onClick={() => onSelectSeller(item[idKey])}
                        >
                            {item.name}   
                        </Button>
                    </List.Item>
                )}
            />
        </div>
        
    );
};

export default SellerList;
