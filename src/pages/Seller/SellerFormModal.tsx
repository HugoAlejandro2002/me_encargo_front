import { Modal, Form, Input, InputNumber, Button, DatePicker, Radio, message, Col, Row } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { registerSellerAPI } from '../../api/seller';
import { useState } from 'react';
import { sellerModel } from '../../models/sellerModels';
import { registerFinanceFluxAPI } from '../../api/financeFlux';

function SellerFormModal({ visible, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);

    const handleFinish = async (sellerData: sellerModel) => {
        setLoading(true);
        const response = await registerSellerAPI(sellerData);
        if (!response.status) {
            message.error('Error al registrar el vendedor');
            setLoading(false)
            return
        }

        message.success('Vendedor registrado con éxito');
        const montoFinanceFlux = parseInt(response.newSeller.alquiler) + parseInt(response.newSeller.exhibicion) + parseInt(response.newSeller.delivery)

        const financeFluxData = {
            id_vendedor: parseInt(response.newSeller.id_vendedor),
            categoria: 'RENOVACION',
            tipo: 'INGRESO',
            concepto: `Vendedor ${response.newSeller.nombre} ${response.newSeller.apellido} - ${response.newSeller.marca} renovado`,
            monto: montoFinanceFlux,
        }

        const resFinanceFlux = await registerFinanceFluxAPI(financeFluxData)
        if (!resFinanceFlux.status) {
            message.error(`Error al registrar el ingreso con monto Bs. ${montoFinanceFlux}`)
        }
        message.success('Ingreso registrado con éxito')
        onSuccess()
        setLoading(false);
    };

    return (
        <Modal
            title="Agregar vendedor"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                name="sellerForm"
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="nombre"
                            label="Nombres"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="apellido"
                            label="Apellidos"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="marca" label="Marca">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono"
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Input prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="carnet" label="Carnet">
                            <InputNumber style={{ width: '100%' }} prefix={<IdcardOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="direccion" label="Dirección">
                            <Input prefix={<HomeOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="mail" label="Mail">
                    <Input prefix={<MailOutlined />} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="alquiler" label="Alquiler">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="exhibicion" label="Exhibición">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="delivery" label="Delivery">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name='adelanto_servicio' label='Adelanto Servicio'>
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="comision_porcentual" label="Comisión porcentual">
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}%`}
                                min={0}
                                max={100}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="comision_fija" label="Comisión Fija">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name='almacen_caja' label='Almacen Caja'>
                    <InputNumber />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name='fecha_vigencia'
                            label='Fecha Final de Servicio'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='id_trabajador'
                            label='Encargado'
                            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value='1'>Sebas</Radio.Button>
                                <Radio.Button value='2'>Mauri</Radio.Button>
                                <Radio.Button value='3'>Nacho</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default SellerFormModal;
