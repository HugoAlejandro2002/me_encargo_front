import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { parseError } from "./util";

export const checkLogin = async (userData: any) => {
  try {
    const res = await apiClient.post("/user/login", userData);
    return res.data;
  } catch (error) {
    parseError(error as AxiosError);
  }
};

export const getUserByCookie = async () => {
  try {
    const res = await apiClient.get("/user/info");
    return res.data;
  } catch (error) {
    parseError(error as AxiosError);
  }
};
