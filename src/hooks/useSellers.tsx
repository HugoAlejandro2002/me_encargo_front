import { useEffect, useState } from "react"
import { getSellersAPI } from "../api/seller"

const useSellers = () => {

    const [sellers, setSellers] = useState<any>()

    const fetchSellers = async () => {
        try {
            const res = await getSellersAPI()
            setSellers(res)
        } catch (error) {
            console.error('Error obteniendo los vendedores', error)
            setSellers([])
        }
    }

    useEffect(() => {
        fetchSellers()
    }, [])

    return { sellers }
}

export default useSellers