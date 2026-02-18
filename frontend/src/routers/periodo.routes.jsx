// src/routers/periodo.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import PeriodosList from "../modulos/periodos/page/PeriodosList";

export default (
     <Route path="/periodos" element={<PeriodosList />} />
 
);
