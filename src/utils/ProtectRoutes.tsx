import { Outlet, Navigate } from "react-router-dom";

export const ProtectRoutes = () => {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null;
  return token ? <Outlet /> : <Navigate to={"/"} />;
};

export const ProtectAuth = () => {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null;
  return token ? <Navigate to={"/agreement"} /> : <Outlet />;
};
