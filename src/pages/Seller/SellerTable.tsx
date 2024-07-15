import { Table } from 'antd';

const columns = [
    {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
    },
    {
        title: 'Pago Total',
        dataIndex: 'pago_total',
        key: 'pago_total',
    },
    {
        title: 'Fecha Final del Servicio',
        dataIndex: 'fecha_vigencia',
        key: 'fecha_vigencia',
    },
    {
        title: 'Pago Mensual',
        dataIndex: 'pago_mensual',
        key: 'pago_mensual',
    },
    {
        title: 'Porcentaje de comisión',
        dataIndex: 'comision_porcentual',
        key: 'comision_porcentual',
    },
    {
        title: 'Comisión Bs',
        dataIndex: 'comision_fija',
        key: 'comision_fija',
    },
];

const pendingPaymentData = [
    {
        key: '1',
        nombre: 'Javier Pepe',
        pago_total: 'Bs200,00',
        fecha_vigencia: '7/7/2024',
        pago_mensual: 'Bs10,00',
        comision_porcentual: '5%',
        comision_fija: 'Bs10,00',
    },
    {
        key: '2',
        nombre: 'Fabian Tapia',
        pago_total: 'Bs12,00',
        fecha_vigencia: '15/7/2024',
        pago_mensual: 'Bs7,00',
        comision_porcentual: '5%',
        comision_fija: 'Bs6,00',
    },
    // ... otros datos de ejemplo
];

const onTimePaymentData = [
    {
        key: '1',
        nombre: 'Adrian Rodriguez',
        pago_total: 'Bs0,00',
        fecha_vigencia: '8/5/2024',
        pago_mensual: 'Bs0,00',
        comision_porcentual: '8%',
        comision_fija: 'Bs0,00',
    },
    {
        key: '2',
        nombre: 'Andres Quenta',
        pago_total: 'Bs0,00',
        fecha_vigencia: '15/7/2024',
        pago_mensual: 'Bs250,00',
        comision_porcentual: '8%',
        comision_fija: 'Bs0,00',
    },
    // ... otros datos de ejemplo
];

const SellerTable = () => {
    return (
        <div>
            <Table
                columns={columns}
                dataSource={pendingPaymentData}
                title={() => <h2>Pago pendiente</h2>}
                pagination={false}
            />
            <Table
                columns={columns}
                dataSource={onTimePaymentData}
                title={() => <h2>Pago al día</h2>}
                pagination={false}
            />
        </div>
    );
};

export default SellerTable;
