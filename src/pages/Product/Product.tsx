import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../../api/product";
import Button from "antd/es/button";
import ProductFormModal from "./ProductFormModal";
import useProducts from "../../hooks/useProducts";
import useGroup from "../../hooks/useGroup";
import GroupProductTable from "./GroupProductTable";

const Product = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const { groups } = useGroup()

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleSuccess = () => {
        setIsModalVisible(false)
        setRefreshKey(prevKey => prevKey + 1)
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Button onClick={showModal} type='primary'>Agregar Producto</Button>
            </div>
            {
                groups.map( group => 
                    <GroupProductTable group = {group}  />
                )
            }
            <ProductFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Product;
