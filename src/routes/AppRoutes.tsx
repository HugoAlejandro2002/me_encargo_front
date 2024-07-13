import { Routes, Route } from "react-router-dom";
import Products from "../pages/Products/Products";
import Seller from "../pages/Seller/Seller";

function AppRoutes() {
    <>
        <Routes>
            <Route path="/product" element={<Products />} />
            <Route path="/seller" element={<Seller />} />
        </Routes>
    </>
}
export default AppRoutes