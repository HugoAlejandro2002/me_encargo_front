import { AxiosError } from "axios";
import { apiClient } from "./apiClient";

export const checkLogin = async (userData: any) => {
  try {
    const res = await apiClient.post("/user/login", userData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err && err.response && err.response.data) {
      return { success: false, ...err.response.data };
    }
    return { success: false };
  }
};

export const getUserByCookie = async () => {
  try {
    const res = await apiClient.get("/user/info");
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err && err.response && err.response.data) {
      return { success: false, ...err.response.data };
    }
    return { success: false };
  }
};
