//src\routers\cuenta.routes.jsx
import { Route } from "react-router-dom";
import CuentasList from "../modulos/banco/page/CuentasList";

export default (
  <Route path="/cuentas" element={<CuentasList />} />
);