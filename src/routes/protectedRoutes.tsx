import { Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import RoleGuard from "./RoleGuard";
import FinanceFlux from "../pages/FinanceFlux/FinanceFlux";
import Product from "../pages/Product/Product";
import Sales from "../pages/Sales/Sales";
import Seller from "../pages/Seller/Seller";
import Shipping from "../pages/Shipping/Shipping";
import StockManagement from "../pages/StockManagement/StockManagement";
import ErrorPage from "../pages/ErrorPage";
import StatsPage from "../pages/Stats/StatsPage";

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
          <RoleGuard allowedRoles={["admin", "seller"]}>
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
          <RoleGuard allowedRoles={["admin", "seller"]}>
            <StockManagement />
          </RoleGuard>
        ),
      },
      {
        path: "/stats",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <StatsPage />
          </RoleGuard>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
];

export default protectedRoutes;
