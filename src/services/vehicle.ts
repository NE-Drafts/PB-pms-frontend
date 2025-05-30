/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import api from "../config/api";
import type { Dispatch, SetStateAction } from "react";

export const getAllVehicles = async ({
  setLoading,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const res = await api.get("/vehicle/all");
    return res.data?.data?.vehicles;
  } catch (error: any) {
    toast.error(`Fetch failed! ${error?.response?.data?.message}`);
  } finally {
    setLoading(false);
  }
};

export const getUserVehicles = async ({
  setIsLoading,
  userId,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  userId: string;
}) => {
  try {
    setIsLoading(true);
    const res = await api.get(`/vehicle/getByUser/${userId}`);
    return res?.data?.data?.vehicles;
  } catch (error: any) {
    toast.error(`Fetch failed! ${error?.response?.data?.message}`);
  } finally {
    setIsLoading(false);
  }
};
