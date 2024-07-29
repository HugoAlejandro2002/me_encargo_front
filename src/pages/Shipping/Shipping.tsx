import { useState } from "react";
import useProducts from "../../hooks/useProducts";
import ShippingTable from "./ShippingTable";

const Product = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

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
                <h1 className="text-2xl font-bold">Pedidos</h1>
            </div>
            <ShippingTable key={refreshKey} />
        </div>
    );
};

export default Product;
