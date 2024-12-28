import { Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import ErrorPage from "../pages/ErrorPage";
import CashReconciliationPage from "../pages/BoxClose/BoxClosePage";

const publicRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
];

export default publicRoutes;
