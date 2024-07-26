import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

export const getShippingAPI = async () => {
    try {
        const res = await apiClient.get(`/shipping`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

export const registerShippingAPI = async (sellerData: any) => {
    try {
        const res = await apiClient.post(`/shipping/register`, sellerData)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}