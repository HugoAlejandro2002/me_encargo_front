import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Tag,
  DatePicker,
  Modal,
  Typography,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { DATE_TAGS } from "../../constants/fluxes";
import { getFilteredStats } from "../../helpers/financeFluxesHelpers";
import dayjs from "dayjs";

const StatisticCard: FC<any> = ({ title, value, prefix, color }) => (
  <Card>
    <Statistic
      title={<span className="text-mobile-base xl:text-desktop-base">{title}</span>}
      value={value}
      precision={2}
      valueStyle={{ color }}
      prefix={prefix}
    />
  </Card>
);

const StatisticsDashboard = () => {
  const [customDateModal, setCustomDateModal] = useState(false);
  const [stats, setStats] = useState<any>();
  const [selectedTag, setSelectedTag] = useState<string | null>(
    DATE_TAGS.LAST_30_DAYS
  );
  const [customDateRange, setCustomDateRange] = useState<any>([]);

  const fetchStats = async (filter: string = DATE_TAGS.ALL_TIME) => {
    try {
      const statsInfo = await getFilteredStats(filter, customDateRange);
      setStats(statsInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const onTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (!DATE_TAGS.CUSTOM) setCustomDateRange([]);
    if (DATE_TAGS.CUSTOM) {
      setCustomDateModal(true);
    } else {
      setCustomDateModal(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStats(selectedTag || DATE_TAGS.ALL_TIME);
  }, [selectedTag]);

  if (!stats) {
    return <Spin />;
  }

  const espTags = [
    "ÚLTIMOS 7 DÍAS",
    "ÚLTIMOS 30 DÍAS",
    "ÚLTIMOS 90 DÍAS",
    "ESTE AÑO",
    "FECHA PERSONALIZADA",
    "TODO EL TIEMPO",
  ];

  return (
    <>
      <div className="my-4">
        {Object.entries(DATE_TAGS).map(([key, value], index: number) => {
          return (
            <Tag.CheckableTag
              key={key}
              checked={selectedTag === value}
              onChange={() => onTagClick(value)}
              className="text-mobile-sm xl  :text-desktop-sm"
            >
              {espTags[index]}
            </Tag.CheckableTag>
          );
        })}
        {selectedTag === DATE_TAGS.CUSTOM && (
          <>
            <Modal
              open={customDateModal}
              onCancel={() => {
                setSelectedTag(DATE_TAGS.ALL_TIME);
                setCustomDateModal(false);
              }}
              onClose={() => setCustomDateModal(false)}
              onOk={() => {
                fetchStats(DATE_TAGS.CUSTOM);
                setCustomDateModal(false);
              }}
            >
              <DatePicker.RangePicker
                className="mb-4"
                onChange={(dates) => setCustomDateRange(dates)}
                value={customDateRange}
                format="DD-MM-YYYY"
              />
            </Modal>
          </>
        )}
      </div>
      {selectedTag === DATE_TAGS.CUSTOM && (
        <Typography.Text className="text-mobile-base xl:text-desktop-base mb-4" mark>
          Rango seleccionado:{" "}
          {`${dayjs(customDateRange[0]).format("DD-MM-YYYY")} - ${dayjs(
            customDateRange[1]
          ).format("DD-MM-YYYY")}`}
        </Typography.Text>
      )}
      <h2 className="font-semibold text-mobile-lg xl:text-desktop-lg">ESTADISTICAS</h2>
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

      <h2 className="mt-6 text-mobile-lg xl:text-desktop-lg">DELIVERY</h2>
      <Row className="p-6 md:p-4" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12}>
          <StatisticCard
            title="INGRESOS DELIVERY SUELTOS"
            value={stats.deliveryIncome}
            prefix={<DollarOutlined />}
            color="#007bff"
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <StatisticCard
            title="COSTOS DELIVERY"
            value={stats.deliveryExpenses}
            prefix={<CarOutlined />}
            color="#6f42c1"
          />
        </Col>
      </Row>
    </>
  );
};

export default StatisticsDashboard;
