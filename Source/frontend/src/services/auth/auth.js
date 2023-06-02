import axios from "axios";
import { setAccessToken, setRefreshToken } from "../../store/Slice/authSlice";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import { globalNavigate } from "../../Utils/GlobalHistory";
const login = async ({ email, password }) => {
  const response = await axiosBase.post(`auth/login`, {
    email,
    password,
  });
  return response.data;
};
const register = async ({ username, email, password }) => {
  const response = await axiosBase.post(`auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};
const logout = async () => {
  const response = await axiosBase.delete(`auth/logout`);
  const cookies = new Cookies();
  cookies.remove("jwt_authentication");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userPermission");
  return response.data;
};
const refreshToken = async ({ refreshToken }) => {
  const cookies = new Cookies();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
  };
  const { data } = await axios.post(`${baseURL}/auth/refreshToken`, undefined, {
    headers,
  });
  const { refresh, access } = data;
  if (refresh && access) {
    const decoded = jwtDecode(refresh);
    localStorage.setItem("accessToken", JSON.stringify(access));
    cookies.set("jwt_authentication", refresh, {
      expires: new Date(decoded.exp * 1000),
    });
  } else {
    cookies.remove("jwt_authentication");
    localStorage.removeItem("accessToken");
    globalNavigate("/sign-in");
  }
};

export const authService = {
  login,
  register,
  logout,
  refreshToken,
};
