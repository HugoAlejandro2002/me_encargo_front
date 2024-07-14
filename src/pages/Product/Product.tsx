import { useEffect } from "react"
import ProductTable from "./ProductTable"

const Product = () => {
    useEffect(() => {
        console.log("productos cargados")
    }, [])
    return (
        <div>
            <h1>Products Page</h1>
            <ProductTable />
        </div>
    )
}

export default Product
