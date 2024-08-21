import { Modal, Form, DatePicker, Radio, InputNumber, Button, Col, Row, message } from 'antd';
import { useState } from 'react';
import { updateSellerAPI } from '../../api/seller';
import { registerFinanceFluxAPI } from '../../api/financeFlux';
import dayjs from 'dayjs';

const DebtModal = ({ visible, onSuccess, onCancel, seller }: any) => {
    const [loading, setLoading] = useState(false);

    const handleFinish = async (debtInfo: any) => {
        setLoading(true)
        const resSeller = await updateSellerAPI(parseInt(seller.key), debtInfo)
        if (!resSeller?.success) {
            message.error('Error al renovar el vendedor');
            setLoading(false);
            return;
        }
        message.success('Vendedor renovado con éxito')
        const sellerInfo = resSeller.data.updatedSeller
        const montoFinanceFlux = parseInt(sellerInfo.alquiler) + parseInt(sellerInfo.exhibicion) + parseInt(sellerInfo.delivery)

        const financeFluxData = {
            id_vendedor: parseInt(seller.key),
            categoria: 'RENOVACION',
            tipo: 'INGRESO',
            concepto: `Vendedor ${sellerInfo.nombre} ${sellerInfo.apellido} - ${sellerInfo.marca} renovado`,
            monto: montoFinanceFlux,
            esDeuda: debtInfo.isDebt
        }

        const resFinanceFlux = await registerFinanceFluxAPI(financeFluxData)
        if (resFinanceFlux.status) {
            message.success('Ingreso registrado con éxito')
        } else {
            message.error(`Error al registrar el ingreso con monto Bs. ${montoFinanceFlux}`)
        }
        onSuccess()
        setLoading(false)
    }

    return (
        <Modal
            title={'Renovar vendedor'}
            open={visible}
            footer={null}
            onCancel={onCancel}
        >
            <Form onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="isDebt"
                    label='Es deuda?'
                >
                    <Radio.Group>
                        <Radio.Button value={true}>SI</Radio.Button>
                        <Radio.Button value={false}>NO</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="fecha_vigencia"
                    label="Fecha Final del Servicio*"
                    rules={[{ required: true, message: 'Por favor seleccione una fecha final del servicio' }]}
                >
                    <DatePicker
                        className='w-full'
                        defaultValue={(dayjs(seller.fecha_vigencia, "D/M/YYYY/"))}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="alquiler"
                            label="Alquiler"
                            initialValue={seller.alquiler}
                        >
                            <InputNumber
                                className='w-full'
                                prefix='Bs.'
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="exhibicion"
                            label="Exhibición"
                            initialValue={seller.exhibicion}
                        >
                            <InputNumber
                                className='w-full'
                                prefix='Bs.'
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="delivery"
                            label="Delivery"
                            initialValue={seller.delivery}
                        >
                            <InputNumber
                                className='w-full'
                                prefix='Bs.'
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                    <Col>

                    </Col>
                </Row>

                <Form.Item
                    name="comision_porcentual"
                    label="Porcentaje de comisión"
                    initialValue={seller.comision_porcentual.replace('%', '').trim()}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        suffix='%'
                    />
                </Form.Item>

                <Form.Item
                    name="comision_fija"
                    label="Comisión Fija"
                    initialValue={seller.comision_fija.replace('Bs.', '').trim()}
                >
                    <InputNumber
                        prefix="Bs."
                        className='w-full'
                    />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DebtModal;
