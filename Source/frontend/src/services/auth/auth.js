import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import axios from "axios";
import { setAccessToken, setRefreshToken } from "../../store/Slice/authSlice";
import axiosBase from "../../Utils/AxiosInstance";

export const login = async ({ email, password }) => {
  const response = await axiosBase.post(`auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async ({ username, email, password }) => {
  const response = await axiosBase.post(`auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};
export const logout = async ({ accessToken, refreshToken }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${refreshToken}`,
  };
  const response = await axiosBase.delete(`auth/logout`,{headers});
  return response.data;
};
