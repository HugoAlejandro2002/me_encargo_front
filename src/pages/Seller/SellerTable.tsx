import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { getSellersAPI } from "../../api/seller";
import DebtModal from "./DebtModal";
import { EditOutlined } from "@ant-design/icons";
import PayDebtButton from "./components/PayDebtButton";
import { getSellerAdvancesById } from "../../helpers/sellerHelpers";
import SellerInfoModalTry from "./SellerInfoModal";
const SellerTable = ({ refreshKey, setRefreshKey }: any) => {
  const columns = [
    {
      key: "seller_pay_debt",
      render: (_: any, seller: any) => <PayDebtButton seller={seller} />,
    },
    {
      key: "seller_new_debt",
      render: (_: any, seller: any) => (
        <Button
          type="default"
          onClick={() => showModal(seller)}
          icon={<EditOutlined />}
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Pago total",
      dataIndex: "deuda",
      key: "deuda",
    },
    {
      title: "Fecha Vigencia",
      dataIndex: "fecha_vigencia",
      key: "fecha_vigencia",
    },
    {
      title: "Pago Mensual",
      dataIndex: "pago_mensual",
      key: "pago_mensual",
    },
    {
      title: "Comisión Porcentual",
      dataIndex: "comision_porcentual",
      key: "comision_porcentual",
    },
    {
      title: "Comisión Fija",
      dataIndex: "comision_fija",
      key: "comision_fija",
    },
  ];

  const [pendingPaymentData, setPendingPaymentData] = useState([]);
  const [onTimePaymentData, setOnTimePaymentData] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSellerModalVisible, setIsSellerModalVisible] = useState(false);

  async function fetchSellers() {
    try {
      const response = await getSellersAPI();

      const sellersData = response.data || response;

      if (!Array.isArray(sellersData)) {
        console.error("Los datos de vendedores no son un array:", sellersData);
        return;
      }
      const formattedData = await Promise.all(
        sellersData.map(async (seller: any) => {
          console.log("Esto es la deuda ",seller.deuda)
          const finish_date = new Date(seller.fecha_vigencia);
          const advances = await getSellerAdvancesById(seller.id_vendedor);
          const date = new Date(seller.fecha);
          return {
            key: seller.id_vendedor.toString(),
            nombre: `${seller.nombre} ${seller.apellido}`,
            deuda: `Bs. ${seller.deuda}`,
            // deuda: `Bs. ${seller.deuda - advances}`,
            deudaInt: seller.deuda,
            pagoTotalInt: seller.deuda - parseInt(advances),
            fecha_vigencia: finish_date.toLocaleDateString("es-ES"),
            fecha: date.toLocaleDateString("es-ES"),
            pago_mensual: `Bs. ${
              seller.alquiler + seller.exhibicion + seller.delivery
            }`,
            alquiler: seller.alquiler,
            exhibicion: seller.exhibicion,
            delivery: seller.delivery,
            comision_porcentual: `${seller.comision_porcentual}%`,
            comision_fija: `Bs. ${seller.comision_fija}`,
            telefono: seller.telefono,
            mail: seller.mail,
            carnet: seller.carnet,
            adelanto_servicio: seller.adelanto_servicio,
            marca:seller.marca,
          };
        })
      );
      console.log(sellersData)

      // Separar los datos según algún criterio (en este caso, si el pago es pendiente o al día)
      const pendingPayments: any = formattedData.filter(
        (seller: any) => seller.pagoTotal !== "Bs. 0"
      );
      const onTimePayments: any = formattedData.filter(
        (seller: any) => seller.pagoTotal === "Bs. 0"
      );

      setPendingPaymentData(pendingPayments);
      setOnTimePaymentData(onTimePayments);
    } catch (error) {
      console.error("Error al obtener los vendedores:", error);
    }
  }

  const showModal = (seller: any) => {
    setSelectedSeller(seller);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsSellerModalVisible(false);
    setSelectedSeller(null);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    setSelectedSeller(null);
    setRefreshKey((prev: number) => prev + 1);
  };
  const handleRowClick = (seller: any) => {
    setSelectedSeller(seller);
    setIsSellerModalVisible(true);
  };

  useEffect(() => {
    fetchSellers();
    console.log(pendingPaymentData, "ts");
    console.log(onTimePaymentData, "tsa");
  }, [refreshKey]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={pendingPaymentData}
        title={() => (
          <h2 className="text-2xl font-bold">
            Pago pendiente Bs.{" "}
            {pendingPaymentData.reduce(
              (acc: number, seller: any) => acc + seller.pagoTotalInt,
              0
            )}
          </h2>
        )}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Table
        columns={columns}
        dataSource={onTimePaymentData}
        title={() => <h2 className="text-2xl font-bold">Pago al día</h2>}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      {selectedSeller && (
        <DebtModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          seller={selectedSeller}
        />
      )}
      {selectedSeller && (
        <SellerInfoModalTry
          visible={isSellerModalVisible && !isModalVisible}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          seller={selectedSeller}
        />
      )}
    </div>
  );
};

export default SellerTable;
