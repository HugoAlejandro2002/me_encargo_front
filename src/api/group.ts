import { AxiosError } from "axios"
import { apiClient } from "./apiClient"

const parseError = (error: AxiosError) => {
    const err = error
    if (err && err.response && err.response.data) {
        return { success: false, ...err.response.data }
    }
    return { succcess: false }
}

export const getGroupsAPI = async () => {
    try {
        const res = await apiClient.get('/group')
        return res.data
    } catch (error) {
        return parseError(error as AxiosError)
    }
}

export const getProductsInGroupAPI = async (id: number) => {
    try {
        const res = await apiClient.get(`/group/${id}/variants`)
        return res.data
    } catch (error) {
        return parseError(error as AxiosError)
    }
}