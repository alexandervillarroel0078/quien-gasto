// src\routers\reporte_cuentas.routes.jsx
// src/routers/reporte_cuentas.routes.jsx
import { Route } from "react-router-dom";
import ReporteCuentas from "../modulos/banco/page/reporte_cuentas";

export default (
  <Route path="/banco/reportes" element={<ReporteCuentas />} />
);