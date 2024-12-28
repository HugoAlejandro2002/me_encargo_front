import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Table,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IBoxClose } from "../../models/boxClose";
import { getDailySummary, IDailySummary } from "../../helpers/shippingHelpers";
import { registerBoxCloseAPI } from "../../api/boxClose";

const { Title } = Typography;

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  lastClosingBalance?: any;
}

const BoxCloseForm = ({
  onSuccess,
  onCancel,
  lastClosingBalance = "0",
}: Props) => {
  const [coinTotals, setCoinTotals] = useState(0);
  const [billTotals, setBillTotals] = useState(0);
  const [salesSummary, setSalesSummary] = useState<IDailySummary>();
  const [form] = Form.useForm<IBoxClose>();

  const fetchSalesSummary = async () => {
    try {
      const summary = await getDailySummary();
      setSalesSummary(summary || { cash: 0, bank: 0, total: 0 });
      form.setFieldsValue({
        efectivo_inicial: parseFloat(lastClosingBalance.efectivo_real),
        bancario_inicial: 0,
        ventas_efectivo: summary?.cash || 0,
        ventas_qr: summary?.bank || 0,
        efectivo_esperado:
          parseInt(lastClosingBalance.efectivo_real) + summary?.cash,
        bancario_esperado: summary?.bank,
      });
      console.log("set up");
    } catch (error) {
      console.error("Error while fetching sales summary", error);
      setSalesSummary({ cash: 0, bank: 0, total: 0 });
    }
  };
  const coinDenominations = {
    "0.1": "10 ctvs.",
    "0.2": "20 ctvs.",
    "0.5": "50 ctvs.",
    "1": "Bs. 1",
    "2": "Bs 2",
    "5": "Bs 5",
  };
  const billDenominations = {
    "10": "Bs. 10",
    "20": "Bs. 20",
    "50": "Bs. 50",
    "100": "Bs. 100",
    "200": "Bs. 200",
  };

  useEffect(() => {
    fetchSalesSummary();
  }, []);

  useEffect(() => {
    form.setFieldValue("efectivo_real", (coinTotals + billTotals).toFixed(2));
    form.setFieldValue(
      "diferencia_efectivo",
      (
        coinTotals +
        billTotals -
        form.getFieldValue("efectivo_esperado")
      ).toFixed(2)
    );
  }, [coinTotals, billTotals]);

  const handleSubmit = async (values: any) => {
    try {
      // const daily = values.id_efectivo_diario;
      // const totalCash = daily.total_coins + daily.total_bills;
      console.log("i got this");

      const newReconciliation = {
        ...values,
        ingresos_efectivo: values.ventas_efectivo,
        ventas_efectivo: salesSummary?.cash,
      };
      console.log(newReconciliation, "sending this");
      // try {
      //   const res = await registerBoxCloseAPI(newReconciliation);
      //   console.log(res, "tried creating box close");
      // } catch (error) {
      //   console.error("Failed while creating box close");
      // }

      onSuccess();
    } catch (error) {
      console.error("Error saving reconciliation:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
    >
      <Card>
        <Title level={5}>Información General</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Responsable"
            name="responsible"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Fecha">
            <Input
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
              value={dayjs().format("DD/MM/YYYY")}
            />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Resumen de Ventas</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Ultimo cierre de caja (Efectivo)">
            <InputNumber
              prefix="Bs."
              value={lastClosingBalance.efectivo_real}
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Efectivo">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.cash}
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Bancario">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.bank}
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Total">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.total}
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Recuento de Efectivo</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Efectivo inicial"
            name="efectivo_inicial"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item
            label="Ingresos en efectivo"
            name="ventas_efectivo"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Efectivo esperado" name="efectivo_esperado">
            <InputNumber
              prefix="Bs."
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Efectivo real" name="efectivo_real">
            <InputNumber
              prefix="Bs."
              readOnly
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
            />
          </Form.Item>
          <Form.Item label="Diferencia" name="diferencia_efectivo">
            <InputNumber
              prefix="Bs."
              onChange={(value: any) => {
                form.setFieldValue(
                  "diferencia_efectivo",
                  value - form.getFieldValue("efectivo_esperado")
                );
              }}
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
              readOnly
            />
          </Form.Item>
        </div>
      </Card>

      {/* TABLA DE COINS Y BILLS */}
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Title level={5}>Monedas</Title>
            <Table
              dataSource={Object.entries(coinDenominations).map(
                ([value, name]) => ({
                  value,
                  name,
                })
              )}
              columns={[
                {
                  title: "Denominación",
                  dataIndex: "name",
                  key: "name",
                  width: "40%",
                },
                {
                  title: "Cantidad",
                  key: "quantity",
                  width: "30%",
                  render: (_, record) => (
                    <Form.Item
                      name={["coins", record.value]}
                      rules={[{ required: true, message: "Requerido" }]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Total",
                  key: "total",
                  width: "30%",
                  render: (_, record) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const quantity = form.getFieldValue([
                          "coins",
                          record.value,
                        ]);
                        return (
                          <strong>
                            Bs.{" "}
                            {(quantity * parseFloat(record.value) || 0).toFixed(
                              2
                            )}
                          </strong>
                        );
                      }}
                    </Form.Item>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} />
                  <Table.Summary.Cell index={2}>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const coinSum = Object.keys(coinDenominations).reduce(
                          (sum, key) =>
                            sum +
                            (form.getFieldValue(["coins", key]) || 0) *
                              parseFloat(key),
                          0
                        );
                        setCoinTotals(coinSum);
                        return <strong>Bs. {coinTotals.toFixed(2)}</strong>;
                      }}
                    </Form.Item>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>
        {/* BILLETES   */}
        <Col span={12}>
          <Card>
            <Title level={5}>Billetes</Title>
            <Table
              dataSource={Object.entries(billDenominations).map(
                ([value, name]) => ({
                  value,
                  name,
                })
              )}
              columns={[
                {
                  title: "Denominación",
                  dataIndex: "name",
                  key: "name",
                  width: "40%",
                },
                {
                  title: "Cantidad",
                  key: "quantity",
                  width: "30%",
                  render: (_, record) => (
                    <Form.Item
                      name={["bills", record.value]}
                      rules={[{ required: true, message: "Requerido" }]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Total",
                  key: "total",
                  width: "30%",
                  render: (_, record) => (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const quantity = form.getFieldValue([
                          "bills",
                          record.value,
                        ]);
                        return (
                          <strong>
                            Bs.{" "}
                            {(quantity * parseFloat(record.value) || 0).toFixed(
                              2
                            )}
                          </strong>
                        );
                      }}
                    </Form.Item>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} />
                  <Table.Summary.Cell index={2}>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const billSum = Object.keys(billDenominations).reduce(
                          (sum, key) =>
                            sum +
                            (form.getFieldValue(["bills", key]) || 0) *
                              parseFloat(key),
                          0
                        );
                        setBillTotals(billSum);
                        return <strong>Bs. {billTotals.toFixed(2)}</strong>;
                      }}
                    </Form.Item>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={5}>Recuento Bancario</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Bancario inicial"
            name="bancario_inicial"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              onChange={(value: any) => {
                form.setFieldValue(
                  "bancario_esperado",
                  form.getFieldValue("ventas_qr") + value
                );
              }}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label="Ingresos bancarios"
            name={"ventas_qr"}
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              onChange={(value: any) => {
                form.setFieldValue(
                  "bancario_esperado",
                  form.getFieldValue("bancario_inicial") + value
                );
              }}
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Bancario esperado"
            name="bancario_esperado"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Bancario real"
            name="bancario_real"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              onChange={(value: any) => {
                form.setFieldValue(
                  "diferencia_bancario",
                  (value - form.getFieldValue("bancario_esperado")).toFixed(2)
                );
              }}
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Diferencia" name="diferencia_bancario">
            <InputNumber
              prefix="Bs."
              className="w-full bg-gray-300 text-gray-500 pointer-events-none"
              readOnly
            />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Observaciones</Title>
        <Form.Item name="observaciones">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default BoxCloseForm;
