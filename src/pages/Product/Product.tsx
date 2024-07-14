import { useEffect } from "react"
import ProductTable from "./ProductTable"

const Product = () => {
    useEffect(() => {
        console.log("productos cargados")
    }, [])
    return (
        <ProductTable />
    )
}

export default Product
