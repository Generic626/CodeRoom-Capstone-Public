import { Outlet, Navigate } from "react-router-dom";
import { getUser } from "../functions/user-management";

const PrivateRoutes = () => {
  let auth = getUser();
  return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
