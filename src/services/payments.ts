/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import api from "../config/api";

export const getAllPayments = async ({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    const res = await api.get("/payment/all");
    return res.data?.data?.payments;
  } catch (error: any) {
    return toast.error(`Fetch failed! ${error?.response?.data?.message}`);
  } finally {
    setIsLoading(false);
  }
};
