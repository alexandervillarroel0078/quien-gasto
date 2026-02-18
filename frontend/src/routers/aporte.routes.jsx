// src/routers/aporte.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import AportesList from "../modulos/aportes/page/AportesList";

export default (

    <Route path="/aportes" element={<AportesList />} />

);
