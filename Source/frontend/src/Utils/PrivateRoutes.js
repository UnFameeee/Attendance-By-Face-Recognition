import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helper, isTokenExpired } from "./Helper";
import { refreshToken } from "../services/auth/auth";
import Cookies from "universal-cookie";

const PrivateRoutes = () => {
  const cookies = new Cookies();
  const jwt_accessTokenJSON = localStorage.getItem("accessToken");
  const jwt_accessToken = JSON.parse(jwt_accessTokenJSON);
  const jtw_refreshToken = cookies.get("jwt_authentication");
  console.log("is expired", Helper.isTokenExpired(jwt_accessToken));
  if (Helper.isTokenExpired(jwt_accessToken)) {
    if (jtw_refreshToken && !Helper.isTokenExpired(jtw_refreshToken)) {
      refreshToken({ refreshToken: jtw_refreshToken });
      return <Outlet />;
    } else {
      return <Navigate to="/sign-in" />;
    }
  }
  return <Outlet />;
};

export default PrivateRoutes;
