import { AxiosError } from "axios"
import { apiClient } from "./apiClient"
import { parseError } from "./util"

export const getProductsEntryAmount = async (sellerId: any) => {
    try {
        const res = await apiClient.get(`/entry/seller/${sellerId}`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { succcess: false }
    }
}
export const deleteEntryProductsAPI = async (entryIds: number[]) => {
    try {
        const res = await apiClient.delete(`/entry/`, { data: { ids: entryIds } });
        return { success: true, ...res.data };
    } catch (error) {
        parseError(error as AxiosError);
    }
}
export const updateEntry = async (updateEntryData: any, entryId: number) => {
    try {
        const res = await apiClient.put(`/entry/${entryId}`, { newData: updateEntryData })
        return { success: true, ...res.data }
    } catch (error) {
        parseError(error as AxiosError)
    }
}