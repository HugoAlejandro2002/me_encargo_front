import { apiClient } from "./apiClient"



const parseError = (error: AxiosError) => {
    const err = error
    if (err && err.response && err.response.data) {
        return { success: false, ...err.response.data }
    }
    return { succcess: false }
}

export const getSucursalsAPI = async () => {
    try {
        const response = await apiClient.get('/sucursal')
        return response.data
    } catch (error) {
        parseError(error)
    }
}