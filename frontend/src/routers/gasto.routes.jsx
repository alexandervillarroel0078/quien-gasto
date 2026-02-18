// src/routers/gasto.routes.jsx 
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import GastosList from "../modulos/gastos/page/GastosList";

export default (
  <Route element={<RoleRoute />}>
    <Route path="/gastos" element={<GastosList />} />
  </Route>
);
