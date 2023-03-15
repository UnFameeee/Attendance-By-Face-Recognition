import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import axios from "axios";
import { setAccessToken, setRefreshToken } from "../../store/Slice/authSlice";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";

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
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
  };
  const response = await axiosBase.delete(`auth/logout`, { headers });
  return response.data;
};

export const refreshToken = async ({ refreshToken }) => {
  const cookies = new Cookies();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
  };
  const { data } = await axios.post(`${baseURL}/auth/refreshToken`, undefined, {
    headers,
  });
  const { refresh, access } = data;
  const decoded = jwtDecode(refresh);
  localStorage.setItem("accessToken", JSON.stringify(access));
  cookies.set("jwt_authentication", refresh, {
    expires: new Date(decoded.exp * 1000),
  });
};
