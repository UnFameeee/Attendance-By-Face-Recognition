import { Outlet } from "react-router-dom";
import { Helper } from "./Helper";
import UnAuthorize from "../pages/unauthorize/UnAuthorize";

const ProtectedFirstTimeLoginRoute = () => {
  const isFirstTimeLogin = Helper.isFirstTimeLogin();
  if (isFirstTimeLogin) {
    return <Outlet />;
  } else {
    return <UnAuthorize />;
  }
};

export default ProtectedFirstTimeLoginRoute;
