import { Button } from "antd";
import { useState } from "react";
import SalesTable from "./SalesTable";
import SalesFormModal from "./SalesFormmodal";

export const Sales = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        setIsModalVisible(false);
    }

    const handleSuccess = () => {
        setIsModalVisible(false)
        setRefreshKey(prevKey => prevKey + 1)
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Carrito</h1>
                <Button onClick={showModal} type="primary">Realizar Pago</Button>
            </div>
            <SalesTable key={refreshKey}/>
            <SalesFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Sales;
