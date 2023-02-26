import axios from "axios";
import { useQueryClient } from "react-query";
import { isTokenExpired } from "./Helper";
import Cookies from "universal-cookie";

const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosBase;
axiosBase.interceptors.request.use((config) => {
  //   const queryClient = useQueryClient();
  const accessTokenJSON = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(accessTokenJSON);

  if (accessToken && !isTokenExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
axiosBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const queryClient = useQueryClient();
    const cookies = new Cookies();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookies.get("jwt_authentication");

      if (refreshToken && !isTokenExpired(refreshToken)) {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        };
        const { data } = await axios.post("auth/refreshToken", { headers });
        localStorage.setItem("accessToken", data.access);
        // queryClient.setQueryData("accessToken", data.access);
        return axiosBase(originalRequest);
      } else {
        // Handle expired refresh token
        // Redirect to login page or show error message
      }
    }

    return Promise.reject(error);
  }
);
