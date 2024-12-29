import { DatePicker, Input, message, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getShippingsAPI } from '../../api/shipping';
import ShippingInfoModal from './ShippingInfoModal';
import { InfoCircleOutlined } from '@ant-design/icons';
import ShippingStateModal from './ShippingStateModal';
import { getSucursalsAPI } from '../../api/sucursal';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ShippingTable = (refreshKey: any) => {
    const [shippingData, setShippingData] = useState([])
    const [esperaData, setEsperaData] = useState([]);
    const [porEntregarData, setPorEntregarData] = useState([]);
    const [entregadoData, setEntregadoData] = useState([]);
    const [filteredEsperaData, setFilteredEsperaData] = useState([]);
    const [filteredPorEntregarData, setFilteredPorEntregarData] = useState([]);
    const [filteredEntregadoData, setFilteredEntregadoData] = useState([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [visibility, setVisibility] = useState({
        espera: false,
        porEntregar: false,
        entregado: false,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModaStatelVisible, setIsModalStateVisible] = useState(false);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [otherLocation, setOtherLocation] = useState('');
    const [sucursal, setSucursal] = useState([] as any[]);

    const fetchShippings = async () => {
        try {
            const apiData = await getShippingsAPI();
            const dataWithKey = apiData.map((pedido: any) => ({
                ...pedido,
                key: pedido.id_pedido
            }));
            setShippingData(dataWithKey)
        } catch (error) {
            console.error("Error fetching shipping data:", error);
        }
    }

    const filterByLocationAndDate = (data: any) => {
        return data.filter((pedido: any) => {
            const isOtherLocation = selectedLocation === 'other';
            const matchesLocation = isOtherLocation
            ? !sucursal.some((suc) => suc.nombre.toLowerCase() === pedido.lugar_entrega.toLowerCase()) &&
              (!otherLocation || pedido.lugar_entrega.toLowerCase().includes(otherLocation.toLowerCase()))
            : !selectedLocation || pedido.lugar_entrega.toLowerCase().includes(selectedLocation.toLowerCase());

            // const matchesLocation = isOtherLocation
            // ? !sucursal.some((suc) => suc.nombre.toLowerCase() === pedido.lugar_entrega.toLowerCase())
            // : !selectedLocation || pedido.lugar_entrega.toLowerCase().includes(selectedLocation.toLowerCase());

            // const matchesLocation = !selectedLocation || pedido.lugar_entrega.toLowerCase().includes(selectedLocation.toLowerCase());
            const matchesDateRange = dateRange[0] && dateRange[1] ? (
                new Date(pedido.fecha_pedido) >= dateRange[0] && new Date(pedido.fecha_pedido) <= dateRange[1]
            ) : true;
            return matchesLocation && matchesDateRange;
        });
    };
    // setFilteredEsperaData(filterByLocationAndDate(esperaData));
    // setFilteredPorEntregarData(filterByLocationAndDate(porEntregarData));
    // setFilteredEntregadoData(filterByLocationAndDate(entregadoData));

    const toggleVisibility = (key: 'espera' | 'porEntregar' | 'entregado') => {
        setVisibility(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const columns = [
        {
            title: '',
            dataIndex: 'infoButton',
            key: 'infoButton',
            width: '5%',
            render: (_: any, record: any) => (
                <InfoCircleOutlined
                    style={{ fontSize: '20px', color: '#1890ff', cursor: 'pointer' }}
                    onClick={() => handleIconClick(record)}
                />
            )
        },
        {
            title: 'Fecha Pedido',
            dataIndex: 'fecha_pedido',
            key: 'fecha_pedido',
            render: (text: string) => new Date(text).toLocaleDateString('es-ES')
        },
        {
            title: 'Lugar de entrega',
            dataIndex: 'lugar_entrega',
            key: 'lugar_entrega'
        },
        {
            title: 'Vendedor',
            dataIndex: 'vendedor',
            key: 'vendedor',
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
    ];

    const handleIconClick = (order: any) => {
        setSelectedShipping(order);
        setIsModalStateVisible(true);
    };
    const handleRowClick = (order: any) => {
        setSelectedShipping(order);
        setIsModalVisible(true);
    };
    const fetchSucursal = async () => {
        try {
            const response = await getSucursalsAPI()
            setSucursal(response)
        } catch (error) {
            message.error('Error al obtener los vendedores');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            return await fetchShippings();
        }
        const newData = fetchData()
        fetchSucursal();
    }, [refreshKey])

    useEffect(() => {
        setEsperaData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'En espera'));
        setPorEntregarData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'Por entregar'));
        setEntregadoData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'Entregado'));

        // setFilteredEsperaData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'En espera'));
        // setFilteredPorEntregarData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'Por entregar'));
        // setFilteredEntregadoData(shippingData.filter((pedido: any) => pedido.estado_pedido === 'Entregado'));

        setFilteredEsperaData(filterByLocationAndDate(esperaData));
        setFilteredPorEntregarData(filterByLocationAndDate(porEntregarData));
        setFilteredEntregadoData(filterByLocationAndDate(entregadoData));
    }, [shippingData, selectedLocation, dateRange, esperaData, porEntregarData, entregadoData])

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Select
                    className="mr-2 w-1/5"
                    placeholder="Filtrar por lugar/sucursales"
                    onChange={(value) => {
                        setSelectedLocation(value || '');
                        if (value !== 'other') {
                            setOtherLocation('');
                        }
                    }}
                    allowClear
                >
                    <Option value="other">Otro lugar</Option>
                    {sucursal.map((sucursal: any) => (
                        <Option key={sucursal.id_sucursal} value={sucursal.nombre}>
                            {sucursal.nombre}
                        </Option>
                    ))}

                </Select>
                {selectedLocation === 'other' && (
                    <Input
                        className="mt-2 w-1/5"
                        placeholder="Especificar otro lugar"
                        value={otherLocation}
                        onChange={(e) => setOtherLocation(e.target.value)}
                    />
                )}
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
            </div>
            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('espera')}  className='text-mobile-sm xl:text-desktop-3xl'>En espera</h2>
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
            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('porEntregar')}  className='text-mobile-sm xl:text-desktop-3xl'>Por Entregar</h2>
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

            <h2 style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('entregado')}  className='text-mobile-sm xl:text-desktop-3xl'>Entregado</h2>
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
                visible={isModalVisible && !isModaStatelVisible}
                shipping={selectedShipping}
                onClose={() => setIsModalVisible(false)}
                onSave={() => {
                    setIsModalVisible(false);
                    fetchShippings();
                }}
            />
            <ShippingStateModal
                visible={isModaStatelVisible}
                order={selectedShipping}
                onClose={() => {
                    setIsModalStateVisible(false)
                    setIsModalVisible(false)
                }}
                onSave={() => {
                    setIsModalStateVisible(false);
                    fetchShippings();
                }}
                shipping={selectedShipping}
            />
        </div>
    );
};
export default ShippingTable;
