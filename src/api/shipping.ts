import { AxiosError } from "axios"
import { apiClient } from "./apiClient"
import { parseError } from "./util"

const getShippingsAPI = async () => {
    try {
        const res = await apiClient.get('/shipping')
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

const registerShippingAPI = async (shippingData: any) => {
    try {
        const res = await apiClient.post('/shipping/register', shippingData)
        return { success: true, ...res.data }
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

const registerSalesToShippingAPI = async (salesData: any) => {
    try {
        const res = await apiClient.post('/shipping/register/sales', salesData)
        return { success: true, ...res.data }
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

const updateShippingAPI = async (updateShippingData: any, shippingId: number) => {
    try {
        const res = await apiClient.put(`/shipping/${shippingId}`, { newData: updateShippingData })
        return { success: true, ...res.data }
    } catch (error) {
        parseError(error as AxiosError)
    }
}

export { getShippingsAPI, registerShippingAPI, registerSalesToShippingAPI, updateShippingAPI }
