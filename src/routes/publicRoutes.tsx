import { Navigate } from "react-router-dom";
// import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/Login/LoginPage";

const publicRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
];

export default publicRoutes;
