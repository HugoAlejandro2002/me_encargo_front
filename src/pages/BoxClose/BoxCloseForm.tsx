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

const { Title } = Typography;

interface ReconciliationFormData {
  responsible: string;
  opening_balance: number;
  closing_balance: number;
  cash_sales: number;
  cash_expenses: number;
  cash_delivery: number;
  observations: string;
  // Coins and bills
  coins: { [key: string]: number };
  bills: { [key: string]: number };
  // Cash reconciliation
  cash_initial: number;
  cash_income: number;
  cash_final: number;
  cash_difference: number;
  // Bank reconciliation
  bank_initial: number;
  bank_income: number;
  bank_final: number;
  bank_difference: number;
}

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  lastClosingBalance?: number;
  salesSummary?: {
    cash: number;
    bank: number;
    total: number;
  };
}

const CashReconciliationForm = ({
  onSuccess,
  onCancel,
  lastClosingBalance = 0,
  salesSummary = { cash: 0, bank: 0, total: 0 },
}: Props) => {
  const [form] = Form.useForm<ReconciliationFormData>();
  const [coinTotals, setCoinTotals] = useState<{ [key: string]: number }>({});
  const [billTotals, setBillTotals] = useState<{ [key: string]: number }>({});

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
      render: (denomination: string, _: any, type: "coins" | "bills") =>
        `Bs. ${
          (type === "coins"
            ? coinTotals[denomination]
            : billTotals[denomination]) || 0
        }`,
    },
  ];

  useEffect(() => {
    form.setFieldsValue({
      opening_balance: lastClosingBalance,
      cash_sales: 0,
      cash_expenses: 0,
      cash_delivery: 0,
      observations: "",
      coins: coinDenominations.reduce(
        (acc, denom) => ({ ...acc, [denom]: 0 }),
        {}
      ),
      bills: billDenominations.reduce(
        (acc, denom) => ({ ...acc, [denom]: 0 }),
        {}
      ),
      cash_initial: lastClosingBalance,
      cash_income: 0,
      cash_final: 0,
      cash_difference: 0,
      bank_initial: 0,
      bank_income: 0,
      bank_final: 0,
      bank_difference: 0,
    });
  }, [lastClosingBalance, form]);

  const handleSubmit = async (values: ReconciliationFormData) => {
    try {
      const totalCoins = Object.entries(coinTotals).reduce(
        (sum, [_, total]) => sum + total,
        0
      );
      const totalBills = Object.entries(billTotals).reduce(
        (sum, [_, total]) => sum + total,
        0
      );
      const totalCash = totalCoins + totalBills;

      const expected_balance =
        values.opening_balance +
        values.cash_sales -
        values.cash_expenses -
        values.cash_delivery;
      const difference = totalCash - expected_balance;

      const newReconciliation = {
        id_reconciliation: Date.now(),
        fecha: dayjs().format("YYYY-MM-DD"),
        expected_balance,
        difference,
        total_coins: totalCoins,
        total_bills: totalBills,
        ...values,
      };

      console.log("New reconciliation:", newReconciliation);

      onSuccess();
      form.resetFields();
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
            <Input value={dayjs().format("DD/MM/YYYY")} disabled />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Resumen de Ventas</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Efectivo">
            <InputNumber
              prefix="Bs."
              value={salesSummary.cash}
              disabled
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Bancario">
            <InputNumber
              prefix="Bs."
              value={salesSummary.bank}
              disabled
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Total">
            <InputNumber
              prefix="Bs."
              value={salesSummary.total}
              disabled
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
            name="cash_initial"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" disabled />
          </Form.Item>
          <Form.Item
            label="Ingresos en efectivo"
            name="cash_income"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" />
          </Form.Item>
          <Form.Item label="Efectivo final" name="cash_final">
            <InputNumber
              prefix="Bs."
              className="w-full"
              value={
                Object.values(coinTotals).reduce((a, b) => a + b, 0) +
                Object.values(billTotals).reduce((a, b) => a + b, 0)
              }
              disabled
            />
          </Form.Item>
          <Form.Item label="Diferencia" name="cash_difference">
            <InputNumber prefix="Bs." className="w-full" disabled />
          </Form.Item>
        </div>
      </Card>

      <Card>
        <Title level={5}>Recuento Bancario</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Bancario inicial"
            name="bank_initial"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" />
          </Form.Item>
          <Form.Item
            label="Ingresos bancarios"
            name="bank_income"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" />
          </Form.Item>
          <Form.Item
            label="Bancario final"
            name="bank_final"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <InputNumber prefix="Bs." className="w-full" />
          </Form.Item>
          <Form.Item label="Diferencia" name="bank_difference">
            <InputNumber prefix="Bs." className="w-full" disabled />
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
                  Bs. {Object.values(coinTotals).reduce((a, b) => a + b, 0)}
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
                  Bs. {Object.values(billTotals).reduce((a, b) => a + b, 0)}
                </strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card>
        <Title level={5}>Observaciones</Title>
        <Form.Item name="observations">
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

export default CashReconciliationForm;
