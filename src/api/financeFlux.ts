import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

export const getFinancesFluxAPI = async () => {
    try {
        const res = await apiClient.get(`/financeFlux`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

export const registerFinanceFluxAPI = async (financeFluxData: any) => {
    try {
        const res = await apiClient.post(`/financeFlux/register`, financeFluxData)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}
export const getSellerByShippingAPI = async (sellerId: any) => {
    try {
        const res = await apiClient.get(`/financeFlux/seller/${sellerId}`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }

    }
}
export const getWorkerByShippingAPI = async (workerId: any) => {
    try {
        const res = await apiClient.get(`/financeFlux/worker/${workerId}`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }

    }
}
export const getSellerInfoAPI = async (sellerId: any) => {
    try {
        const res = await apiClient.get(`/financeFlux/sellerInf/${sellerId}`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }

    }
}