import axios from "axios";
import { Helper, isTokenExpired } from "./Helper";
import Cookies from "universal-cookie";
import { createStandaloneToast } from "@chakra-ui/toast";
import { globalNavigate } from "./GlobalHistory";
import jwtDecode from "jwt-decode";

// export const baseURL = "http://localhost:8081/api";
export const baseURL = "https://unfame.tech:8081/api";

const { toast } = createStandaloneToast();
const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const cookies = new Cookies();
export default axiosBase;
axiosBase.interceptors.request.use((config) => {
  const accessTokenJSON = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(accessTokenJSON);
  const refreshToken = cookies.get("jwt_authentication");
  if (accessToken && !Helper.isTokenExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (!refreshToken && accessToken != null) {
    console.log(accessToken)
    cookies.remove("jwt_authentication");
    localStorage.removeItem("accessToken");
    alert("Your token have been expired, please sign in again!")
    globalNavigate("/sign-in");
  }
  return config;
});
axiosBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookies.get("jwt_authentication");

      if (refreshToken && !Helper.isTokenExpired(refreshToken)) {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        };
        const { data } = await axios.post("auth/refreshToken", undefined, {
          headers,
        });
        console.log(data);
        const { refresh, access } = data;
        if (refresh && access) {
          const decoded = jwtDecode(refresh);
          localStorage.setItem("accessToken", JSON.stringify(access));
          cookies.set("jwt_authentication", refresh, {
            expires: new Date(decoded.exp * 1000),
          });
          return axiosBase(originalRequest);
        } else {
          cookies.remove("jwt_authentication");
          localStorage.removeItem("accessToken");
          globalNavigate("/sign-in");
        }
      } else {
        cookies.remove("jwt_authentication");
        localStorage.removeItem("accessToken");
        globalNavigate("/sign-in");
        // Handle expired refresh token
        // Redirect to login page or show error message
      }
    }

    return Promise.reject(error);
  }
);
