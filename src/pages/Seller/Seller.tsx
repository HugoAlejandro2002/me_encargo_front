import { Button } from "antd";
import SellerTable from "./SellerTable";
import SellerForm from "./SellerFormModal";
import { useState } from "react";

export const Seller = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        setIsModalVisible(false);
        // Aquí normalmente enviarías los datos al backend o actualizarías tu estado
    }
    return (
        <div>
            <div className="flex items-stretch justify-between mb-4">
                <h1 className="text-2xl font-bold">Vendedores</h1>
                <Button onClick={showModal} type="primary">Agregar Vendedor</Button>
            </div>
            <SellerTable />
            <SellerForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onFinish={onFinish}
            />
        </div>
    );
};

export default Seller;
