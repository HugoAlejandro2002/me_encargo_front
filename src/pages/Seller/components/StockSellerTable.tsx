import { InputNumber, Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface StockSellerTableProps {
  data: any[];
  handleValueChange: (key: any, field: any, value: any) => void;
}

const StockSellerTable = ({
  data,
  handleValueChange
}:StockSellerTableProps)=> {
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
            title: "Producto",
            dataIndex: "nombre_producto",
            key: "nombre_producto",
        },
        {
            title: "Cantidad",
            dataIndex: "cantidad_por_sucursal",
            key: "cantidad_por_sucursal",
            render: (_: any, record: any) => (
              <InputNumber
                min={0}
                value={record.producto_sucursal[0]?.cantidad_por_sucursal || 0}
                onChange={(value) => handleValueChange(record.key, "precio_unitario", value)}
              />
            ),
        }
    ];
    useEffect(() => {

      }, [data]);
    return (
        <div>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
        </div>
      );

}
export default StockSellerTable
