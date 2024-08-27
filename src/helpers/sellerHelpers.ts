import { message } from "antd";
import { getShippingsBySellerIdAPI } from "../api/shipping";

export const getSellerAdvancesById = async (sellerId: number) => {
  const res = await getShippingsBySellerIdAPI(sellerId);
  if (res?.status !== 200) {
    message.error("Fallo al calcular los adelantos del vendedor");
    return 0;
  }
  //   console.log(res.data, "xd");

  const sellerAdvances = res.data.reduce(
    (acc: number, shipping: any) => acc + shipping.adelanto_cliente,
    0
  );
  if (isNaN(sellerAdvances)) {
    console.log("NAN", res.data, sellerId);
  }
  return sellerAdvances;
};
