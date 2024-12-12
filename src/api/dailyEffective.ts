import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { parseError } from "./util";

export const getDailyEffectivesAPI = async () => {
  try {
    const res = await apiClient.get("/dailyEffective");
    return res.data;
  } catch (error) {
    parseError(error as AxiosError);
  }
};

export const registerDailyEffectiveAPI = async (boxCloseData: any) => {
  try {
    const res = await apiClient.post("/dailyEffective/register", boxCloseData);
    return res.data;
  } catch (error) {
    parseError(error as AxiosError);
  }
};

export const getDailyEffectiveByIdAPI = async (id: string) => {
  try {
    const res = await apiClient.get(`/dailyEffective/${id}`);
    return res.data;
  } catch (error) {
    parseError(error as AxiosError);
  }
};
