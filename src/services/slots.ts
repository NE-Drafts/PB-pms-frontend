/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import api from "../config/api";
import type { Dispatch, SetStateAction } from "react";

export const getAllSlots = async ({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    const res = await api.get("/slot/all");
    return res?.data?.data?.slots;
  } catch (error: any) {
    return toast.error(`Fetch failed! ${error?.response?.data?.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const createSlot = async ({
  slotNumber,
  setIsLoading,
}: {
  slotNumber: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    await api.post("/slot/register", { slotNumber });
    toast.success("Slot created successfully");
    window.location.reload();
  } catch (error: any) {
    return toast.error(
      `Slot creation failed! ${error?.response?.data?.message}`
    );
  } finally {
    setIsLoading(false);
  }
};
