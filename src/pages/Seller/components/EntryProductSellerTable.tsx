import { Button, InputNumber, Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface EntryProductSellerTableProps {
  data: any[];
  handleValueChange: (key: any, field: any, value: any) => void;
  onDeleteProduct: (key: string, isEntryProduct: boolean) => void;

}

const EntryProductSellerTable = ({
  data,
  handleValueChange,
  onDeleteProduct
}:EntryProductSellerTableProps)=> {
    const columns = [
        {
            title: "Fecha",
            dataIndex: "fecha_ingreso",
            key: "fecha_ingreso",
            render: (text: string) => {
              return dayjs(text).format('DD/MM/YYYY'); 
            },
        },
        {
            title: "Producto",
            dataIndex: ["producto", "nombre_producto"],
            key: "nombre_producto",
        },
        {
            title: "Cantidad",
            dataIndex: "cantidad_ingreso",
            key: "cantidad_ingreso",
            render: (_: any, record: any) => (
              <InputNumber
                min={0}
                value={record.cantidad_ingreso || 0}
                onChange={(value) => handleValueChange(record.key, "cantidad_ingreso", value)}
              />
            ),
        },
        {
          title: "Acción",
          key: "action",
          render: (_: any, record: any) => (
            <Button type="link" onClick={() => onDeleteProduct(record.key, true)}>
              Eliminar
            </Button>
          ),
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
export default EntryProductSellerTable
