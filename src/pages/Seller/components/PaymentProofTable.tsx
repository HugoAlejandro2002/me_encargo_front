import { InputNumber, Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface PaymentProofProps {
  data: any[];
//   handleValueChange: (key: any, field: any, value: any) => void;
}

const PaymentProofTable = ({
  data,
//   handleValueChange
}:PaymentProofProps)=> {
    const columns = [
        {
            title: "Fecha",
            dataIndex: "fecha_de_ingreso",
            key: "fecha_de_ingreso",
            render: (text: string) => {
              return dayjs(text).format('DD/MM/YYYY'); 
            },
        },
        {
            title: "Hora",
            dataIndex: "hora_emision",
            key: "hora_emision",
            render: (text: string) => {
              return dayjs(text).format('HH:mm');
            },
        },
        {
            title: "Total Ventas",
            dataIndex: "total_ventas",
            key: "total_ventas",
        },
        {
            title: "Total adelantos",
            dataIndex: "total_adelantos",
            key: "total_adelantos",
        },
    ];
    useEffect(() => {

      }, [data]);
    return (
        <div>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
        </div>
      );

}
export default PaymentProofTable
