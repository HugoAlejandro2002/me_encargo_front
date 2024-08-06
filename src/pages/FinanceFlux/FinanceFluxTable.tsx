import { Input, Select, Table } from "antd"
import { getFinancesFluxAPI, getSellerByShippingAPI, getWorkerByShippingAPI } from "../../api/financeFlux";
import { useEffect, useState } from "react";

const FinanceFluxTable = (refreshKey: any) => {
    const [dataWithKey, setDataWithKey] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    const financeFluxTypes: any = {
        1: "GASTO",
        2: "INGRESO",
        3: "INVERSION"
    }

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

    useEffect(() => {
        fetchFinances();
    }, [refreshKey])

    useEffect(() => {
        const filterByType = (data: any) => {
            if (!selectedType || selectedType === '') {
                return data; 
            }
            return data.filter((financeFlux: any) => {
                return financeFlux.tipo.toLowerCase() === financeFluxTypes[selectedType].toLowerCase()
            });
        };
        setFilteredData(filterByType(dataWithKey));
    }, [selectedType, dataWithKey])

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
            <Select
            className="mr-2 w-1/5"
                placeholder="Filtrar por tipo"
                onChange={(value) => setSelectedType(value || '')}
                options={Object.entries(financeFluxTypes).map(([key, value]) => ({
                    value: key,
                    label: value
                }))}
                allowClear
            />
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={false}
            />
        </div>
    )
}

export default FinanceFluxTable