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
import { IDailyEffective } from "../../models/dailyEffective";
import {
  getDailyEffectiveByIdAPI,
  getDailyEffectivesAPI,
} from "../../api/dailyEffective";

function round(num: number) {
  return Math.round(num * 100) / 100;
}

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
      const boxCloses = await getBoxClosesAPI();
      const dailyEffective: IDailyEffective[] = await getDailyEffectivesAPI();
      console.log("im daiylign");
      console.log(dailyEffective);
      console.log(boxCloses);
      const formattedData = boxCloses.map((boxClose: IBoxClose) => {
        const currDailyEffective = dailyEffective.find(
          (daily) =>
            boxClose.id_efectivo_diario.id_efectivo_diario ===
            daily.id_efectivo_diario
        );
        return {
          ...boxClose,
          total_coins: currDailyEffective!.total_coins,
          total_bills: currDailyEffective!.total_bills,
        };
      });

      console.log("im formatting");
      console.log(formattedData);
      setBoxClosings(formattedData);
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
    {
      title: "Desglose",
      children: [
        {
          title: "Monedas",
          dataIndex: "total_coins",
          key: "total_coins",
          render: (amount: number) => `Bs. ${amount}`,
        },
        {
          title: "Billetes",
          dataIndex: "total_bills",
          key: "total_bills",
          render: (amount: number) => `Bs. ${amount}`,
        },
      ],
    },
    {
      title: "Bancario",
      children: [
        {
          title: "Inicial",
          dataIndex: "bancario_inicial",
          key: "bancario_inicial",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
        {
          title: "Ingresos",
          dataIndex: "ventas_qr",
          key: "ventas_qr",
          render: (amount: number) => `Bs. ${round(amount)}`,
        },
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
            lastClosingBalance={boxClosings[0]?.efectivo_real || 0}
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
              (acc, curr) => {
                return {
                  ingresos_efectivo:
                    acc.ingresos_efectivo +
                    parseFloat(curr.ingresos_efectivo as any),
                  diferencia_efectivo:
                    acc.diferencia_efectivo +
                    parseFloat(curr.diferencia_efectivo as any),
                  total_coins: acc.total_coins + curr.total_coins,
                  total_bills: acc.total_bills + curr.total_bills,
                  ingresos_bancario:
                    acc.ingresos_bancario + parseFloat(curr.ventas_qr as any),
                  diferencia_bancario:
                    acc.diferencia_bancario +
                    parseFloat(curr.diferencia_bancario as any),
                };
              },
              {
                ingresos_efectivo: 0,
                diferencia_efectivo: 0,
                total_coins: 0,
                total_bills: 0,
                ingresos_bancario: 0,
                diferencia_bancario: 0,
              }
            );

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>Totales</strong>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1} colSpan={2}>
                  Bs. {totals.ingresos_efectivo}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2}>
                  <Tag
                    color={
                      totals.diferencia_efectivo === 0 ? "success" : "error"
                    }
                  >
                    Bs. {totals.diferencia_efectivo}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={2}>
                  Bs. {totals.total_coins}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={2}>
                  Bs. {totals.total_bills}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={2}>
                  Bs. {totals.ingresos_bancario}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={2}>
                  <Tag
                    color={
                      totals.diferencia_bancario === 0 ? "success" : "error"
                    }
                  >
                    Bs. {totals.diferencia_bancario}
                  </Tag>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default BoxClosePage;
