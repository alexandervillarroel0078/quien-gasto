// src/routers/resumen.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import ResumenPeriodo from "../modulos/resumen/page/ResumenPeriodo";

export default (
     <Route path="/resumen/:periodoId" element={<ResumenPeriodo />} />
   
);
