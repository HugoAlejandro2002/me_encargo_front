import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  DatePicker,
  Space,
  Tag,
  Tooltip,
  Modal,
} from "antd";
import dayjs from "dayjs";
import CashReconciliationForm from "./BoxCloseForm";
import {
  PlusOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getBoxClosesAPI } from "../../api/boxClose";
import { IBoxClose } from "../../models/boxClose";

// Updated mock data to include coins and bills
function round(num: number) {
  return Math.round(num * 100) / 100;
}
const mockData = [
  {
    id_reconciliation: 1,
    fecha: "2024-05-20",
    responsible: "Juan Pérez",
    opening_balance: 1000.0,
    closing_balance: 1500.0,
    expected_balance: 1500.0,
    difference: 0.0,
    cash_sales: 800.0,
    cash_expenses: 300.0,
    cash_delivery: 0.0,
    observations: "Todo cuadrado correctamente",
    // Cash reconciliation
    cash_initial: 1000.0,
    cash_income: 800.0,
    cash_final: 1500.0,
    cash_difference: 0.0,
    // Bank reconciliation
    bank_initial: 0.0,
    bank_income: 0.0,
    bank_final: 0.0,
    bank_difference: 0.0,
    // Coins and bills
    total_coins: 100.0,
    total_bills: 1400.0,
    coins: {
      "0.1": 50,
      "0.2": 25,
      "0.5": 40,
      "1": 30,
      "2": 15,
      "5": 5,
    },
    bills: {
      "10": 20,
      "20": 15,
      "50": 10,
      "100": 8,
      "200": 2,
    },
  },
  // ... (other mock data entries following the same structure)
];

const BoxClosePage = () => {
  const [boxClosings, setBoxClosings] = useState<IBoxClose[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] =
    useState<IBoxClose | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    [dayjs().startOf("month"), dayjs().endOf("month")]
  );

  const fetchBoxClosings = async () => {
    setLoading(true);
    try {
      const data = await getBoxClosesAPI();
      console.log(`onmg im dating `);
      console.log(data);
      setBoxClosings(data);
    } catch (error) {
      console.error("Error fetching boxClosings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxClosings();
  }, [dateRange]);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: any, b: any) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    },
    {
      title: "Responsable",
      dataIndex: "responsible",
      key: "responsible",
    },
    {
      title: "Efectivo",
      children: [
        {
          title: "Inicial",
          dataIndex: "efectivo_inicial",
          key: "efectivo_inicial",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        {
          title: "Ingresos",
          dataIndex: "ingresos_efectivo",
          key: "ingresos_efectivo",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        {
          title: "Final",
          dataIndex: "efectivo_esperado",
          key: "efectivo_esperado",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        {
          title: "Diferencia",
          dataIndex: "diferencia_efectivo",
          key: "diferencia_efectivo",
          render: (amount: number) => {
            const color =
              amount === 0 ? "success" : amount > 0 ? "warning" : "error";
            const icon =
              amount === 0 ? <CheckCircleOutlined /> : <WarningOutlined />;
            return (
              <Tooltip title={amount === 0 ? "Cuadrado" : "Descuadre"}>
                <Tag icon={icon} color={color}>
                  Bs. {round(amount)}
                </Tag>
              </Tooltip>
            );
          },
        },
      ],
    },
    // {
    //   title: "Desglose",
    //   children: [
    //     {
    //       title: "Monedas",
    //       dataIndex: "total_coins",
    //       key: "total_coins",
    //       render: (amount: number) => `Bs. ${round(amount)}`,
    //     },
    //     {
    //       title: "Billetes",
    //       dataIndex: "total_bills",
    //       key: "total_bills",
    //       render: (amount: number) => `Bs. ${round(amount)}`,
    //     },
    //   ],
    // },
    {
      title: "Bancario",
      children: [
        {
          title: "Inicial",
          dataIndex: "bancario_inicial",
          key: "bancario_inicial",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        // {
        //   title: "Ingresos",
        //   dataIndex: "bank_income",
        //   key: "bank_income",
        //   render: (amount: number) => `Bs. ${round(amount)}`,
        // },
        {
          title: "Final",
          dataIndex: "bancario_real",
          key: "bancario_real",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        {
          title: "Diferencia",
          dataIndex: "diferencia_bancario",
          key: "diferencia_bancario",
          render: (amount: number) => {
            const color =
              amount === 0 ? "success" : amount > 0 ? "warning" : "error";
            const icon =
              amount === 0 ? <CheckCircleOutlined /> : <WarningOutlined />;
            return (
              <Tooltip title={amount === 0 ? "Cuadrado" : "Descuadre"}>
                <Tag icon={icon} color={color}>
                  Bs. {round(amount)}
                </Tag>
              </Tooltip>
            );
          },
        },
      ],
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
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
    setSelectedReconciliation(null);
    fetchBoxClosings();
  };

  const handleRowClick = (record: any) => {
    setSelectedReconciliation(record);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cierre de Caja</h1>
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
              onClick={() => {
                setSelectedReconciliation(null);
                setShowForm(true);
              }}
            >
              Nuevo Cierre
            </Button>
          </Space>
        </div>

        <Modal
          title={selectedReconciliation ? "Ver Cierre" : "Nuevo Cierre"}
          open={showForm}
          onCancel={() => {
            setShowForm(false);
            setSelectedReconciliation(null);
          }}
          footer={null}
          width={1000}
        >
          <CashReconciliationForm
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedReconciliation(null);
            }}
            lastClosingBalance={boxClosings[0]?.closing_balance || 0}
            initialData={selectedReconciliation}
          />
        </Modal>

        <Table
          columns={columns}
          dataSource={boxClosings}
          loading={loading}
          rowKey="id_reconciliation"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} registros`,
          }}
          scroll={{ x: "max-content" }}
          summary={(pageData) => {
            const totals = pageData.reduce(
              (acc, curr) => ({
                cash_income: acc.cash_income + curr.cash_income,
                cash_difference: acc.cash_difference + curr.cash_difference,
                total_coins: acc.total_coins + curr.total_coins,
                total_bills: acc.total_bills + curr.total_bills,
                bank_income: acc.bank_income + curr.bank_income,
                bank_difference: acc.bank_difference + curr.bank_difference,
              }),
              {
                cash_income: 0,
                cash_difference: 0,
                total_coins: 0,
                total_bills: 0,
                bank_income: 0,
                bank_difference: 0,
              }
            );

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>Totales</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  Bs. {totals.cash_income.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Tag
                    color={totals.cash_difference === 0 ? "success" : "error"}
                  >
                    Bs. {totals.cash_difference.toFixed(2)}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  Bs. {totals.total_coins.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  Bs. {totals.total_bills.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  Bs. {totals.bank_income.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Tag
                    color={totals.bank_difference === 0 ? "success" : "error"}
                  >
                    Bs. {totals.bank_difference.toFixed(2)}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default BoxClosePage;
