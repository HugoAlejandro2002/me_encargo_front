import { Button, DatePicker, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getShippingsAPI } from '../../api/shipping';
import ShippingInfoModal from './ShippingInfoModal';

const { RangePicker } = DatePicker;

const ShippingTable = (refreshKey: any) => {
    const [esperaData, setEsperaData] = useState([]);
    const [porEntregarData, setPorEntregarData] = useState([]);
    const [stockInsuficienteData, setStockInsuficienteData] = useState([]);
    const [entregadoData, setEntregadoData] = useState([]);
    const [filteredEsperaData, setFilteredEsperaData] = useState([]);
    const [filteredPorEntregarData, setFilteredPorEntregarData] = useState([]);
    const [filteredEntregadoData, setFilteredEntregadoData] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [visibility, setVisibility] = useState({
        espera: false,
        porEntregar: false,
        entregado: false,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchShippings = async () => {
        try {
            const apiData = await getShippingsAPI();
            const dataWithKey = apiData.map((pedido: any) => ({
                ...pedido,
                key: pedido.id_pedido
            }));
            setEsperaData(dataWithKey.filter((pedido: any) => pedido.estado_pedido === 'En espera'));
            setPorEntregarData(dataWithKey.filter((pedido: any) => pedido.estado_pedido === 'Por Entregar'));
            setEntregadoData(dataWithKey.filter((pedido: any) => pedido.estado_pedido === 'Entregado'));
        } catch (error) {
            console.error("Error fetching shipping data:", error);
        }
    }
    const handleSearch = () => {
        const filterByLocationAndDate = (data: any) => {
            return data.filter((pedido: any) => {
                const matchesLocation = !selectedLocation || pedido.lugar_entrega.toLowerCase().includes(selectedLocation.toLowerCase());
                const matchesDateRange = dateRange[0] && dateRange[1] ? (
                    new Date(pedido.fecha_pedido) >= dateRange[0] && new Date(pedido.fecha_pedido) <= dateRange[1]
                ) : true;
                return matchesLocation && matchesDateRange;
            });
        };
        setFilteredEsperaData(filterByLocationAndDate(esperaData));
        setFilteredPorEntregarData(filterByLocationAndDate(porEntregarData));
        setFilteredEntregadoData(filterByLocationAndDate(entregadoData));
    };
    const toggleVisibility = (key: 'espera' | 'porEntregar' | 'entregado') => {
        setVisibility(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const columns = [
        {
            title: 'Fecha Pedido',
            dataIndex: 'fecha_pedido',
            key: 'fecha_pedido',
            render: (text: string) => new Date(text).toLocaleDateString('es-ES')
        },
        {
            title: 'Vendedor',
            dataIndex: 'stockActual',
            key: 'stockActual',
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
    ];

    const handleRowClick = (order: any) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    useEffect(() => {
        fetchShippings();
        //handleSearch();     Con esto se podria sin el boton
    }, [refreshKey, selectedLocation, dateRange, esperaData, porEntregarData, entregadoData])

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Buscar por lugar de entrega"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                />
                <RangePicker
                    onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                            setDateRange([dates[0].toDate(), dates[1].toDate()]);
                        } else {
                            setDateRange([null, null]);
                        }
                    }}
                    style={{ marginRight: 8 }}
                />
                <Button type="primary" onClick={handleSearch}>Buscar</Button>
            </div>
            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('espera')}>En espera</h2>
            {visibility.espera && (
                <Table
                    columns={columns}
                    dataSource={filteredEsperaData}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record)
                    })}
                />
            )}
            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('porEntregar')}>Por Entregar</h2>
            {visibility.porEntregar && (
                <Table
                    columns={columns}
                    dataSource={filteredPorEntregarData}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record)
                    })}
                />
            )}

            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('entregado')}>Entregado</h2>
            {visibility.entregado && (
                <Table
                    columns={columns}
                    dataSource={filteredEntregadoData}
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record)
                    })}
                />
            )}
            <ShippingInfoModal
                visible={isModalVisible}
                order={selectedOrder}
                onClose={() => setIsModalVisible(false)}
                onSave={() => {
                    setIsModalVisible(false);
                    fetchShippings();
                }}
            />
        </div>
    );
};
export default ShippingTable;
