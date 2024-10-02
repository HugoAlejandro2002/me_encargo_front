import boxIcon from "../assets/boxIcon.svg";
import sellerIcon from "../assets/sellersIcon.svg";
import cartIcon from "../assets/cartIcon.svg";
import shippingIcon from "../assets/shippingIcon.svg";
import financeFluxIcon from "../assets/financeFluxIcon.svg";
import stockManagementIcon from "../assets/stockManagement.svg";

export const menu = [
  {
    path: "/product",
    label: "Inventario",
    icon: boxIcon,
    roles: ["admin", "seller"],
  },
  { path: "/seller", label: "Vendedores", icon: sellerIcon, roles: ["admin"] },
  { path: "/sales", label: "Ventas", icon: cartIcon, roles: ["admin"] },
  { path: "/shipping", label: "Pedidos", icon: shippingIcon, roles: ["admin"] },
  {
    path: "/financeFlux",
    label: "Flujo Financiero",
    icon: financeFluxIcon,
    roles: ["admin"],
  },
  {
    path: "/stock",
    label: "Stock",
    icon: stockManagementIcon,
    roles: ["admin", "seller"],
  },
  {
    path: "/seller-info",
    label: "Mi Información",
    icon: sellerIcon, 
    roles: ["seller"],
  },
];
