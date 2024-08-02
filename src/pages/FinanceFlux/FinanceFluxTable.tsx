import { Table } from "antd"
import { getFinancesFluxAPI } from "../../api/financeFlux";
import { useEffect, useState } from "react";


const FinanceFluxTable = (refreshKey: any) => {
    const [dataWithKey, setDataWithKey] = useState([]);
    const fetchFinances = async () => {
        try {
            const apiData = await getFinancesFluxAPI();
            const dataWithKeys = apiData.map((financeFlux: any) => ({
                ...financeFlux,
                key: financeFlux.id_flujo_financiero // Usa un campo único como key
            }));
            setDataWithKey(dataWithKeys);
        } catch (error) {
            console.error("Error fetching shipping data:", error);
        }
    }
    useEffect(() => {
        fetchFinances();
    }, [refreshKey])
    const columns = [
        {
            title: "Tipo",
            dataIndex: "tipo",
            key: "finance_flux_type"
        },
        {
            title: "Categoría",
            dataIndex: "categoria",
            key: "finance_flux_category"
        },
        {
            title: "Monto",
            dataIndex: "monto",
            key: "finance_flux_amount"
        },
        {
            title: "Concepto",
            dataIndex: "concepto",
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
            dataSource={dataWithKey}
            pagination={false}
            title={() => <h2 className="text-2xl font-bold">GASTOS E INGRESOS</h2>}
        />
    )
}

export default FinanceFluxTable