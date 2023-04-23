import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helper } from "./Helper";
import { refreshToken } from "../services/auth/auth";
import Cookies from "universal-cookie";
import UnAuthorize from "../pages/unauthorize/UnAuthorize";

const PrivateRoutes = () => {
  const cookies = new Cookies();
  const jwt_accessTokenJSON = localStorage.getItem("accessToken");
  const jwt_accessToken = JSON.parse(jwt_accessTokenJSON);
  const jtw_refreshToken = cookies.get("jwt_authentication");
  console.log("is access expired", Helper.isTokenExpired(jwt_accessToken));
  const userRole = Helper.getUserRole();
  const location = useLocation();
  const screenAuthorize = Helper.getScreenAuthorization(
    userRole.role,
    location.pathname
  );
  if (jwt_accessToken) {
    if (Helper.isTokenExpired(jwt_accessToken)) {
      if (jtw_refreshToken && !Helper.isTokenExpired(jtw_refreshToken)) {
        refreshToken({ refreshToken: jtw_refreshToken });
        if (screenAuthorize.auth) {
          return <Outlet />;
        } else {
          return <UnAuthorize />;
        }
      } else {
        return <Navigate to="/sign-in" />;
      }
    } else {
      if (screenAuthorize.auth) {
        return <Outlet />;
      } else {
        return <UnAuthorize />;
      }
    }
  } else {
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoutes;
