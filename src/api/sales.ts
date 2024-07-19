import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

export const getSalesAPI = async () => {
    try {
        const res = await apiClient.get(`/sales`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

export const registerSalesAPI = async (salesData: any) => {
    try {
        const res = await apiClient.post(`/sales/register`, salesData)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}