import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  Table,
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
  const [coinTotals, setCoinTotals] = useState<{ [key: string]: number }>({});
  const [billTotals, setBillTotals] = useState<{ [key: string]: number }>({});
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
  const coinDenominations = ["0.1", "0.2", "0.5", "1", "2", "5"];
  const billDenominations = ["10", "20", "50", "100", "200"];

  const calculateTotal = (amount: number, quantity: number) => {
    return parseFloat((amount * quantity).toFixed(2));
  };

  const columns = [
    {
      title: "Corte",
      dataIndex: "denomination",
      key: "denomination",
      render: (value: string) => `Bs. ${value}`,
    },
    {
      title: "Cantidad",
      dataIndex: "denomination",
      key: "quantity",
      render: (denomination: string, _: any, type: "coins" | "bills") => (
        <Form.Item name={[type, denomination]} noStyle>
          <InputNumber
            min={0}
            className="w-full"
            onChange={(value) => {
              const amount = parseFloat(denomination);
              const total = calculateTotal(amount, value || 0);
              if (type === "coins") {
                setCoinTotals((prev) => ({ ...prev, [denomination]: total }));
              } else {
                setBillTotals((prev) => ({ ...prev, [denomination]: total }));
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total",
      dataIndex: "denomination",
      key: "total",
      render: (denomination: string, _: any, type: "coins" | "bills") => {
        const total =
          type === "coins"
            ? coinTotals[denomination]
            : billTotals[denomination];
        return `Bs. ${total || 0}`;
      },
    },
  ];

  useEffect(() => {
    fetchSalesSummary();
  }, []);

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
      console.log(newReconciliation, 'sending this');
      try {
        const res = await registerBoxCloseAPI(newReconciliation);
        console.log(res, "tried creating box close");
      } catch (error) {
        console.error("Failed while creating box close");
      }

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
            <Input value={dayjs().format("DD/MM/YYYY")} readOnly />
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
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Efectivo">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.cash}
              readOnly
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Bancario">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.bank}
              readOnly
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Total">
            <InputNumber
              prefix="Bs."
              value={salesSummary?.total}
              readOnly
              className="w-full"
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
            <InputNumber prefix="Bs." className="w-full" readOnly />
          </Form.Item>
          <Form.Item
            label="Ingresos en efectivo"
            name="ventas_efectivo"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber
              prefix="Bs."
              onChange={(value: any) => {
                form.setFieldValue(
                  "efectivo_esperado",
                  value + parseFloat(lastClosingBalance.efectivo_real)
                );
              }}
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Efectivo esperado" name="efectivo_esperado">
            <InputNumber
              prefix="Bs."
              className="w-full"
              value={
                Object.values(coinTotals).reduce((a, b) => a + b, 0) +
                Object.values(billTotals).reduce((a, b) => a + b, 0)
              }
              readOnly
            />
          </Form.Item>
          <Form.Item label="Efectivo real" name="efectivo_real">
            <InputNumber
              prefix="Bs."
              className="w-full"
              onChange={(value: any) => {
                form.setFieldValue(
                  "diferencia_efectivo",
                  value - form.getFieldValue("efectivo_esperado")
                );
              }}
              value={
                Object.values(coinTotals).reduce((a, b) => a + b, 0) +
                Object.values(billTotals).reduce((a, b) => a + b, 0)
              }
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
              className="w-full"
              readOnly
            />
          </Form.Item>
        </div>
      </Card>

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
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label="Bancario esperado"
            name="bancario_esperado"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" readOnly />
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
                  value - form.getFieldValue("bancario_esperado")
                );
              }}
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Diferencia" name="diferencia_bancario">
            <InputNumber prefix="Bs." className="w-full" readOnly />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Monedas</Title>
        <Table
          dataSource={coinDenominations.map((d) => ({ denomination: d }))}
          columns={columns.map((col) => ({
            ...col,
            render: (...args) => col.render(...args, "coins"),
          }))}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2}>
                <strong>
                  Bs.{" "}
                  {Object.values(coinTotals)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2)}
                </strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card>
        <Title level={5}>Billetes</Title>
        <Table
          dataSource={billDenominations.map((d) => ({ denomination: d }))}
          columns={columns.map((col) => ({
            ...col,
            render: (...args) => col.render(...args, "bills"),
          }))}
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2}>
                <strong>
                  Bs.{" "}
                  {Object.values(billTotals)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2)}
                </strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
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
