import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

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
        if (err && err.message && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}

export { getShippingsAPI, registerShippingAPI }
