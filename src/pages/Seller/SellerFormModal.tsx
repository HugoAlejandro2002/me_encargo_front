import { Modal, Form, Input, InputNumber, Button, DatePicker, ConfigProvider, Radio } from 'antd';
import es_ES from 'antd/lib/locale/es_ES'
const SellerFormModal = ({ visible, onCancel, onFinish }: any) => {
    return (
        <Modal
            title="Agregar vendedor"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                name="sellerForm"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item name="marca" label="Marca">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="telefono"
                    label="Telefono"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="carnet" label="Carnet">
                    <Input />
                </Form.Item>
                <Form.Item name="direccion" label="Direccion">
                    <Input />
                </Form.Item>
                <Form.Item name="mail" label="Mail">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="pagoMensual"
                    label="Pago Mensual"
                >
                    <InputNumber
                        formatter={value => `Bs ${value}`}
                        // parser={value => value.replace(/Bs\s?|(,*)/g, '')}
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    name="comisionPorcentual"
                    label="Comision porcentual"
                >
                    <InputNumber
                        formatter={value => `${value}%`}
                        // parser={value => value.replace('%', '')}
                        min={0}
                        max={100}
                    />
                </Form.Item>
                <Form.Item
                    name="comisionFija"
                    label="Comision Fija"
                >
                    <InputNumber
                        formatter={value => `Bs ${value}`}
                        // parser={value => value.replace(/Bs\s?|(,*)/g, '')}
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    name='adelantoComision'
                    label='Adelanto Comision'
                >
                    <InputNumber
                        formatter={value => `Bs ${value}`}
                        // parser={value => value.replace(/Bs\s?|(,*)/g, '')}
                        min={0}
                    />
                </Form.Item>
                <ConfigProvider
                // locale={{
                //     ...es_ES,
                //     DatePicker!: {
                //         ...es_ES.DatePicker,
                //         lang: {
                //             ...es_ES.DatePicker!.lang,
                //             today: 'Hoy'
                //         }
                //     }
                // }}
                >
                    <Form.Item
                        name='fechaVigencia'
                        label='Fecha Final de Servicio'
                        rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                </ConfigProvider>
                <Form.Item
                    name='encargado'
                    label='Encargado'
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Radio.Group>
                        <Radio.Button value='a'>Sebas</Radio.Button>
                        <Radio.Button value='b'>Mauri</Radio.Button>
                        <Radio.Button value='c'>Nacho</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SellerFormModal;