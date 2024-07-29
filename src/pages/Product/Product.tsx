import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import { getProductCategoryAPI, getProductFeaturesAPI, getProductsAPI } from "../../api/product";
import Button from "antd/es/button";
import ProductFormModal from "./ProductFormModal";
import useProducts from "../../hooks/useProducts";
import useGroup from "../../hooks/useGroup";
import GroupProductTable from "./GroupProductTable";
import AddVariantModal from "./AddVariantModal";

const Product = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState(null);
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

    const showVariantModal = (group) => {
        setSelectedGroup(group);
        setIsVariantModalVisible(true);
    };

    const handleVariantCancel = () => {
        setIsVariantModalVisible(false);
        setSelectedGroup(null);
    };

    const handleVariantAdd = (newVariant) => {
        // Call API to add new variant
        console.log("New Variant:", newVariant);
        handleVariantCancel();
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Button onClick={showModal} type='primary'>Agregar Producto</Button>
            </div>
            {
               groups.map(group => 
                    <GroupProductTable 
                        key={group.id}
                        group={group}
                        onAddVariant={() => showVariantModal(group)} 
                    />
                )
            }
            <ProductFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
            {selectedGroup && (
                <AddVariantModal
                    visible={isVariantModalVisible}
                    onCancel={handleVariantCancel}
                    onAdd={handleVariantAdd}
                    group={selectedGroup}
                />
            )}
        </div>
    );
};

export default Product;
