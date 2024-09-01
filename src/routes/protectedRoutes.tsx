import { Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import RoleGuard from "./RoleGuard";
import FinanceFlux from "../pages/FinanceFlux/FinanceFlux";
import Product from "../pages/Product/Product";
import Sales from "../pages/Sales/Sales";
import Seller from "../pages/Seller/Seller";
import Shipping from "../pages/Shipping/Shipping";
import StockManagement from "../pages/StockManagement/StockManagement";
import LoginPage from "../pages/Login/LoginPage";

const protectedRoutes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/product",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Product />
          </RoleGuard>
        ),
      },
      {
        path: "/seller",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Seller />
          </RoleGuard>
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Sales />
          </RoleGuard>
        ),
      },
      {
        path: "/shipping",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <Shipping />
          </RoleGuard>
        ),
      },
      {
        path: "/financeFlux",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <FinanceFlux />
          </RoleGuard>
        ),
      },
      {
        path: "/stock",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <StockManagement />
          </RoleGuard>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
];

export default protectedRoutes;
