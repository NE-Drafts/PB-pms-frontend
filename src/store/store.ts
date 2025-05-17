import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types";

const initialState: {
  user: User;
  token: string;
  isLoggedIn: boolean;
} = {
  user: {
    id: "",
    names: "",
    email: "",
    role: "",
    phone: "",
  },
  token: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = { ...payload.user };
      state.token = payload.token;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = {
        ...initialState.user,
      };
      state.token = "";
      localStorage.removeItem("token");
      window.location.replace("/");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
