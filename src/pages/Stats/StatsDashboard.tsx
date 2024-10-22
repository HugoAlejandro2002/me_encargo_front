import { Card, Row, Col, Statistic, Select, Spin } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { getStatsAPI } from "../../api/financeFlux";

const StatisticCard: FC<any> = ({ title, value, prefix, color }) => (
  <Card>
    <Statistic
      title={title}
      value={value}
      precision={2}
      valueStyle={{ color }}
      prefix={prefix}
    />
  </Card>
);

const options = [
  { label: "Prueba 1", value: 1 },
  { label: "Prueba 2", value: 2 },
  { label: "Prueba 3", value: 3 },
  { label: "Prueba 4", value: 4 },
  { label: "Prueba 5", value: 5 },
];

//TODO: use real data / finish other stats
const StatisticsDashboard = () => {
  const [stats, setStats] = useState<any>({});

  const fetchStats = async () => {
    try {
      const statsInfo = await getStatsAPI();
      setStats(statsInfo);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    <Spin />;
  }
  return (
    <div>
      <Select
        className="w-96 m-2"
        placeholder={"Seleciona el filtro"}
        title={"xd"}
        options={options}
      >
        dsfjk
      </Select>
      <h2 className="font-semibold">DATOS</h2>
      <Row className="p-6 md:p-4" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="INGRESOS"
            value={stats!.income || 0}
            prefix={<DollarOutlined />}
            color="#20c997"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="GASTOS"
            value={stats!.expenses || 0}
            prefix={<ShoppingCartOutlined />}
            color="#dc3545"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="UTILIDAD"
            value={stats!.utility || 0}
            prefix={<RiseOutlined />}
            color="#28a745"
          />
        </Col>
      </Row>

      <h2 className="mt-6">DELIVERY</h2>
      <Row className="p-6 md:p-4" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <StatisticCard
            title="INGRESOS DELIVERY SUELTOS"
            value={176}
            prefix={<DollarOutlined />}
            color="#007bff"
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <StatisticCard
            title="COSTOS DELIVERY"
            value={94.8}
            prefix={<CarOutlined />}
            color="#6f42c1"
          />
        </Col>
      </Row>

      <h2 className="mt-6">Cierre de Caja</h2>
      <Row className="p-6 md:p-4" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="CAJA CHICA"
            value={1000}
            prefix={<DollarOutlined />}
            color="#20c997"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="VENTAS EFECTIVO"
            value={0}
            prefix={<DollarOutlined />}
            color="#dc3545"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatisticCard
            title="VENTAS QR"
            value={0}
            prefix={<DollarOutlined />}
            color="#28a745"
          />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsDashboard;
