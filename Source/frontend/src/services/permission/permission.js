import axios from "axios";
import { setAccessToken, setRefreshToken } from "../../store/Slice/authSlice";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";

export const getPermission = async () => {
  const response = await axiosBase.get(`auth/getPerms`);
  return response.data;
};
