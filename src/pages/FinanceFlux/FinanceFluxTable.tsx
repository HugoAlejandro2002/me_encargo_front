import { Button, Input, Table } from "antd"
import { getFinancesFluxAPI, getSellerByShippingAPI, getWorkerByShippingAPI } from "../../api/financeFlux";
import { useEffect, useState } from "react";

const FinanceFluxTable = (refreshKey: any) => {
    const [dataWithKey, setDataWithKey] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    const fetchFinances = async () => {
        try {
            const apiData = await getFinancesFluxAPI();
            const sellerPromises = apiData.map((financeFlux: any) =>
                getSellerByShippingAPI(financeFlux.id_vendedor)
            );
            const workerPromises = apiData.map((financeFlux: any) =>
                getWorkerByShippingAPI(financeFlux.id_trabajador)
            );
            const sellers = await Promise.all(sellerPromises);
            const workers = await Promise.all(workerPromises);

            const dataWithKeys = apiData.map((financeFlux: any, index: number) => ({
                ...financeFlux,
                key: financeFlux.id_flujo_financiero, // Usa un campo único como key
                vendedor: sellers[index]?.nombre + " " + sellers[index]?.apellido,
                encargado: workers[index]?.nombre,
            }));
            setDataWithKey(dataWithKeys);
            setFilteredData(dataWithKeys);
        } catch (error) {
            console.error("Error fetching financeFlux data:", error);
        }
    }
    const handleSearch = () => {
        const filterByType = (data: any) => {
            return data.filter((financeFlux: any) => {
                return (!selectedType || financeFlux.tipo.toLowerCase().includes(selectedType.toLowerCase()));
            })
        }
        setFilteredData(filterByType(dataWithKey));
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
            key: "finance_flux_amount",
            render: (text: any) => `Bs. ${text}`
        },
        {
            title: "Concepto",
            dataIndex: "concepto",
            key: "finance_flux_concept"
        },
        {
            title: "Vendedor",
            dataIndex: "vendedor",
            key: "finance_flux_seller"
        },
        {
            title: "Encargado",
            dataIndex: "encargado",
            key: "finance_flux_worker"
        }

    ]

    return (
        <div>
            <Input
                placeholder="Buscar por tipo"
                value={selectedType}
                onChange={(e: any) => setSelectedType(e.target.value)}
                style={{ width: 200, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSearch}>Buscar</Button>
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={false}
                //title={() => <h2 className="text-2xl font-bold">GASTOS E INGRESOS</h2>}
            />
        </div>
    )
}

export default FinanceFluxTable