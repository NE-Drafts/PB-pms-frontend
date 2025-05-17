/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SetStateAction, Dispatch } from "react";
import toast from "react-hot-toast";
import api from "../config/api";

export const getAll = async ({
  setLoading,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const res = await api.get("/parkingSession/all");
    return res?.data?.data?.parkingSessions;
  } catch (error: any) {
    return toast.error(`Fetch failed! ${error?.response?.data?.message}`);
  } finally {
    setLoading(false);
  }
};

export const createParkingSession = async ({
  plateNumber,
  setIsLoading,
}: {
  plateNumber: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    await api.post("/parkingSession/create", {
      vehiclePlateNumber: plateNumber,
    });
    toast.success("Parking session created successfully");
    window.location.reload()
  } catch (error: any) {
    return toast.error(`Create session failed! ${error?.response?.data?.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const exitParkingSession = async ({setIsLoading, plateNumber}: {setIsLoading: Dispatch<SetStateAction<boolean>>, plateNumber: string}) => {
  try {
    setIsLoading(true)
    await api.put(`/parkingSession/exit/${plateNumber}`)
    toast.success("Vehicle exited successfully!")
    window.location.reload()
  } catch (error: any) {
    return toast.error(`Exit session failed! ${error?.response?.data?.message}`);
  }finally {
    setIsLoading(false)
  }
}

export const getUserParkingSession = async ({setIsLoading, userId}: {setIsLoading: Dispatch<SetStateAction<boolean>>, userId: string}) => {
  try {
    setIsLoading(true)
    const res = await api.get(`/parkingSession/getUserSessions/${userId}`)
    return res?.data?.data?.parkingSessions
  } catch (error:any) {
     return toast.error(`Exit session failed! ${error?.response?.data?.message}`);
  }finally{
    setIsLoading(false)
  }
}