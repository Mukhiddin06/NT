import { Route, Routes } from "react-router-dom";
import { Agreement, Login } from "../pages";
import { ProtectAuth, ProtectRoutes } from "../utils/ProtectRoutes";

const CustomRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectAuth />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<ProtectRoutes />}>
        <Route path="/agreement" element={<Agreement />} />
      </Route>
    </Routes>
  );
};

export default CustomRoutes;
