import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helper, isTokenExpired } from "./Helper";
import { refreshToken } from "../services/auth/auth";
import Cookies from "universal-cookie";

const PrivateRoutes = () => {
  debugger;
  const cookies = new Cookies();
  const jwt_accessTokenJSON = localStorage.getItem("accessToken");
  const jwt_accessToken = JSON.parse(jwt_accessTokenJSON);
  const jtw_refreshToken = cookies.get("jwt_authentication");
  console.log("is access expired", Helper.isTokenExpired(jwt_accessToken));
  if (jwt_accessToken) {
    if (Helper.isTokenExpired(jwt_accessToken)) {
      if (jtw_refreshToken && !Helper.isTokenExpired(jtw_refreshToken)) {
        refreshToken({ refreshToken: jtw_refreshToken });
        return <Outlet />;
      } else {
        return <Navigate to="/sign-in" />;
      }
    }
    else{
      return <Outlet />
    }
  } else {
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoutes;
