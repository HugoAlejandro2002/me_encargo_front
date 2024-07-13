import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

export const getProductsAPI = async () => {
    try {
        const res = await apiClient.get(`/products`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

export const registerProductAPI = async () => {
    try {
        const res = await apiClient.post(`/product/register`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}