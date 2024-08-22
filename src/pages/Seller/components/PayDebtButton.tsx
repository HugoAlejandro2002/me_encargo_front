import { Button, Popconfirm, message } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const PayDebtButton = ({ seller, onConfirm }: any) => {
  const handleConfirm = async () => {
    try {
      // TODO: send info to backend
      console.log("seller:", seller);
      message.success("Pago realizado con éxito");
    } catch (error) {
      message.error("Error al realizar el pago");
    }
  };

  const handleCancel = () => {
    message.info("Pago cancelado");
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popconfirm
        title="Confirmar pago"
        description="¿Estás seguro de que deseas realizar este pago?"
        placement="right"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Sí"
        cancelText="No"
      >
        <Button type="default" icon={<DollarOutlined />} />
      </Popconfirm>
    </div>
  );
};

export default PayDebtButton;
