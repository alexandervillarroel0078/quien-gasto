// src/routers/resumen.routes.jsx
import { Route } from "react-router-dom";
import ResumenPeriodo from "../modulos/resumen/page/ResumenPeriodo";

export default (
  <>
    <Route path="/resumen" element={<ResumenPeriodo />} />
    <Route path="/resumen/periodo/:periodoId" element={<ResumenPeriodo />} />
  </>
);
