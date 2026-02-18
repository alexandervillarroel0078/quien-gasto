import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";
import NoAutorizado from "../auth/NoAutorizado";

// 👇 ROUTES NUEVOS (familia)
import AporteRoutes from "./aporte.routes";
import GastoRoutes from "./gasto.routes";
import PeriodoRoutes from "./periodo.routes";
import PersonaRoutes from "./persona.routes";
import ResumenRoutes from "./resumen.routes";
import BitacoraRoutes from "./bitacora.routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />

          {AporteRoutes}
          {GastoRoutes}
          {PeriodoRoutes}
          {PersonaRoutes}
          {ResumenRoutes}
          {BitacoraRoutes}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
