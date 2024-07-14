import { useEffect } from "react"

const Products = () => {
    useEffect(() => {
        console.log("productos cargados")
    }, [])
    return (
        <div>
            <h1>Products Page</h1>
        </div>
    )
}

export default Products
