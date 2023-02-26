import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isTokenExpired } from "./Helper";

const PrivateRoutes = () => {
  const jwt_tokenJSON = localStorage.getItem("accessToken");
  const jwt_token = JSON.parse(jwt_tokenJSON);
  var isExpired = isTokenExpired(jwt_token);
  console.log("is expired",isExpired)
  return !isExpired ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoutes;
