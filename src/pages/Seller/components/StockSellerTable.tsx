import { Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const StockSellerTable
 = ({ data }: { data: any[] }) => {
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
            render: (_: any, record: any) => 
              record.producto_sucursal[0]?.cantidad_por_sucursal || 0,
        }
    ];
    useEffect(() => {

      }, [data]);
    return (
        <div>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      );

}
export default StockSellerTable
