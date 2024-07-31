import { Table } from "antd"

const FinanceFluxTable = () => {
    const columns = [
        {
            title: "Tipo",
            dataIndex: "finance_flux_type",
            key: "finance_flux_type"
        },
        {
            title: "Categoría",
            dataIndex: "finance_flux_category",
            key: "finance_flux_category"
        },
        {
            title: "Monto",
            dataIndex: "finance_flux_amount",
            key: "finance_flux_amount"
        },
        {
            title: "Concepto",
            dataIndex: "finance_flux_concept",
            key: "finance_flux_concept"
        },
        {
            title: "Vendedor",
            dataIndex: "finance_flux_seller",
            key: "finance_flux_seller"
        },
        {
            title: "Encargado",
            dataIndex: "finance_flux_worker",
            key: "finance_flux_worker"
        }

    ]

    return (
        <Table
            columns={columns}
            pagination={false}
            title={() => <h2 className="text-2xl font-bold">GASTOS E INGRESOS</h2>}
        />
    )
}

export default FinanceFluxTable