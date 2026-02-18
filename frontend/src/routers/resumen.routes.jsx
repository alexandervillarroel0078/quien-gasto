// src/routers/resumen.routes.jsx
import { Route } from "react-router-dom";
import ResumenPeriodo from "../modulos/resumen/page/ResumenPeriodo";

export default (
  <>
    {/* Vista base (desde menú) */}
    <Route path="/resumen" element={<ResumenPeriodo />} />
  </>
);
