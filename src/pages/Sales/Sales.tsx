import { Button } from "antd";
import { useState } from "react";
import SalesTable from "./SalesTable";
import SalesFormModal from "./SalesFormmodal";
import ShippingFormModal from "./ShippingFormmodal";

export const Sales = () => {
    const [modalType, setModalType] = useState<'sales' | 'shipping' | null>(null);
    const [refreshKey, setRefreshKey] = useState(0)

    const showSalesModal = () => {
        setModalType('sales');
    };

    const showShippingModal = () => {
        setModalType('shipping');
    };

    const handleCancel = () => {
        setModalType(null);
    };

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        setModalType(null);
    };

    const handleSuccess = () => {
        setModalType(null);
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Carrito</h1>
                <div className="flex space-x-2">
                    <Button onClick={showSalesModal} type="primary">Realizar Venta</Button>
                    <Button onClick={showShippingModal} type="primary">Realizar Entrega</Button>
                </div>
            </div>
            <SalesTable key={refreshKey} />
            <SalesFormModal
                visible={modalType === 'sales'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
            />
            <ShippingFormModal
                visible={modalType === 'shipping'}
                onCancel={handleCancel}
                onFinish={onFinish}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Sales;
