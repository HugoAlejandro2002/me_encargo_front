import { AxiosError } from "axios"
import { apiClient } from "./apiClient"
import { parseError } from "./util"

export const getSalesAPI = async () => {
    try {
        const res = await apiClient.get(`/sale`)
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
        const res = await apiClient.post(`/sale/register`, salesData)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }
    }
}
export const getProductByShippingAPI = async (shippingId: any) => {
    try {
        const res = await apiClient.get(`/sale/products/${shippingId}`)
        return res.data
    } catch (error) {
        const err = error as AxiosError
        if (err && err.response && err.response.data) {
            return { success: false, ...err.response.data }
        }
        return { success: false }

    }
}
export const updateProductsByShippingAPI = async (shippingId: number, updatedEmtpySalesTable: any, ) => {
    try {
        const res = await apiClient.put(`/sale/products/update/${shippingId}`, updatedEmtpySalesTable )
        return { success: true, ...res.data }
    } catch (error) {
        parseError(error as AxiosError)
    }
}
export const deleteProductsByShippingAPI = async (shippingId: number, deletedEmtpySalesTable: any, ) => {
    try {
        const res = await apiClient.delete(`/sale/products/delete/${shippingId}`, {data:deletedEmtpySalesTable})
        return { success: true, ...res.data }
    } catch (error) {
        parseError(error as AxiosError)
    }
}
// export const deleteProductsByShippingAPI = async (shippingId: any, products:any) => {
//     try {
//         const res = await apiClient.get(`/sale/products/delete/${shippingId}`, products)
//         return res.data
//     } catch (error) {
//         const err = error as AxiosError
//         if (err && err.response && err.response.data) {
//             return { success: false, ...err.response.data }
//         }
//         return { success: false }

//     }
// }
// export const updateProductsByShippingAPI = async (shippingId: any, products:any) => {
//     try {
//         const res = await apiClient.get(`/sale/products/update/${shippingId}`, products)
//         return res.data
//     } catch (error) {
//         const err = error as AxiosError
//         if (err && err.response && err.response.data) {
//             return { success: false, ...err.response.data }
//         }
//         return { success: false }

//     }
// }