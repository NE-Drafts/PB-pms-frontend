/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import api from "../config/api";
import type { Dispatch, SetStateAction } from "react";
import { login } from "../store/store";
import type { User } from "../types";

export const signIn = async ({
  email,
  password,
  dispatch,
  setLoading,
}: {
  email: string;
  password: string;
  dispatch: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const res = await api.post("/auth/login", { email, password });
    if (res.status == 200) {
      dispatch(
        login({ user: res.data?.data?.user, token: res.data?.data?.token })
      );
      localStorage.setItem("token", res.data?.data?.token);
      const user: User = res.data?.data?.user;
      toast.success("Welcome to our Vehicle PMS");
      setTimeout(() => {
        if (user?.role === "ADMIN")
          return window.location.replace("/admin/dashboard");
        return window.location.replace("/user/dashboard");
      }, 1000);
    }
  } catch (error: any) {
    toast.error(`Login failed! ${error?.response?.data?.message}`);
  } finally {
    setLoading(false);
  }
};

export const signUp = async ({
  names,
  email,
  phone,
  password,
  setLoading,
}: {
  names: string;
  email: string;
  phone: string;
  password: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const res = await api.post("/auth/register", {
      names,
      email,
      phone,
      password,
      role: "USER",
    });
    if (res.status == 201) {
      toast.success("Your account was registered successfully");
      window.location.replace("/");
      return;
    }
    return toast.error(res?.data?.message);
  } catch (error: any) {
    return toast.error(`Register failed! ${error?.response?.data?.message}`);
  } finally {
    setLoading(false);
  }
};
