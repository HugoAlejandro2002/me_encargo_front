import { useState, useEffect } from "react";
import { Table, Card, Button, DatePicker, Space, Tag, Tooltip } from "antd";
// import { getCashReconciliationsAPI } from '../../api/cashReconciliation';
import dayjs from "dayjs";
// import CashReconciliationForm from './CashReconciliationForm';
import {
  PlusOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const mockData = [
  {
    id_reconciliation: 1,
    fecha: "2024-05-20",
    opening_balance: 1000.0,
    closing_balance: 1500.0,
    expected_balance: 1500.0,
    difference: 0.0,
    cash_sales: 800.0,
    cash_expenses: 300.0,
    cash_delivery: 0.0,
    observations: "Todo cuadrado correctamente",
  },
  {
    id_reconciliation: 2,
    fecha: "2024-03-21",
    opening_balance: 1500.0,
    closing_balance: 2200.0,
    expected_balance: 2300.0,
    difference: -100.0,
    cash_sales: 1200.0,
    cash_expenses: 400.0,
    cash_delivery: 0.0,
    observations: "Faltante en caja de Bs. 100",
  },
  {
    id_reconciliation: 3,
    fecha: "2024-03-22",
    opening_balance: 2200.0,
    closing_balance: 3500.0,
    expected_balance: 3400.0,
    difference: 100.0,
    cash_sales: 1500.0,
    cash_expenses: 200.0,
    cash_delivery: 100.0,
    observations: "Sobrante en caja de Bs. 100",
  },
  {
    id_reconciliation: 4,
    fecha: "2024-03-23",
    opening_balance: 3500.0,
    closing_balance: 4200.0,
    expected_balance: 4200.0,
    difference: 0.0,
    cash_sales: 900.0,
    cash_expenses: 200.0,
    cash_delivery: 0.0,
    observations: "",
  },
  {
    id_reconciliation: 5,
    fecha: "2024-03-24",
    opening_balance: 4200.0,
    closing_balance: 5100.0,
    expected_balance: 5000.0,
    difference: 100.0,
    cash_sales: 1200.0,
    cash_expenses: 400.0,
    cash_delivery: 100.0,
    observations: "Revisar diferencia positiva",
  },
];

const CashReconciliationPage = () => {
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    [dayjs().startOf("month"), dayjs().endOf("month")]
  );

  // Simulating API call with mock data
  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter mock data based on date range
      //   const filteredData = mockData.filter((item) => {
      //     const itemDate = dayjs(item.fecha);
      //     return (
      //       dateRange &&
      //       itemDate.isAfter(dateRange[0]) &&
      //       itemDate.isBefore(dateRange[1])
      //     );
      //   });

      setReconciliations(mockData);
    } catch (error) {
      console.error("Error fetching reconciliations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliations();
  }, [dateRange]);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: any, b: any) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    },
    {
      title: "Saldo Inicial",
      dataIndex: "opening_balance",
      key: "opening_balance",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Saldo Final",
      dataIndex: "closing_balance",
      key: "closing_balance",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Saldo Esperado",
      dataIndex: "expected_balance",
      key: "expected_balance",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Diferencia",
      dataIndex: "difference",
      key: "difference",
      render: (amount: number) => {
        const color =
          amount === 0 ? "success" : amount > 0 ? "warning" : "error";
        const icon =
          amount === 0 ? <CheckCircleOutlined /> : <WarningOutlined />;

        return (
          <Tooltip title={amount === 0 ? "Cuadrado" : "Descuadre"}>
            <Tag icon={icon} color={color}>
              Bs. {amount.toFixed(2)}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Ventas Efectivo",
      dataIndex: "cash_sales",
      key: "cash_sales",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Gastos Efectivo",
      dataIndex: "cash_expenses",
      key: "cash_expenses",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Delivery Efectivo",
      dataIndex: "cash_delivery",
      key: "cash_delivery",
      render: (amount: number) => `Bs. ${amount.toFixed(2)}`,
    },
    {
      title: "Observaciones",
      dataIndex: "observations",
      key: "observations",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || "-"}</span>
        </Tooltip>
      ),
    },
  ];

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchReconciliations();
  };

  return (
    <div className="p-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Reconciliación de Caja</h1>
          <Space>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(dates) =>
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
              }
              format="DD/MM/YYYY"
              allowClear={true}
            />
            <Button onClick={() => setDateRange(null)} type="default">
              Ver Todo
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowForm(true)}
            >
              Nueva Reconciliación
            </Button>
          </Space>
        </div>

        {showForm && (
          <div className="mb-4">
            <Card title="Nueva Reconciliación">
              <p>Form placeholder - To be implemented</p>
              <Space>
                <Button type="primary" onClick={handleFormSuccess}>
                  Guardar
                </Button>
                <Button onClick={() => setShowForm(false)}>Cancelar</Button>
              </Space>
            </Card>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={reconciliations}
          loading={loading}
          rowKey="id_reconciliation"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} registros`,
          }}
          scroll={{ x: "max-content" }}
          summary={(pageData) => {
            const totals = pageData.reduce(
              (acc, curr) => ({
                cash_sales: acc.cash_sales + curr.cash_sales,
                cash_expenses: acc.cash_expenses + curr.cash_expenses,
                cash_delivery: acc.cash_delivery + curr.cash_delivery,
                difference: acc.difference + curr.difference,
              }),
              {
                cash_sales: 0,
                cash_expenses: 0,
                cash_delivery: 0,
                difference: 0,
              }
            );

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <strong>Totales</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Tag color={totals.difference === 0 ? "success" : "error"}>
                    Bs. {totals.difference.toFixed(2)}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  Bs. {totals.cash_sales.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  Bs. {totals.cash_expenses.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  Bs. {totals.cash_delivery.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default CashReconciliationPage;
