//src\routers\movimiento.routes.jsx
import { Route } from "react-router-dom";
import MovimientosList from "../modulos/banco/page/MovimientosList";

export default (
  <Route path="/movimientos" element={<MovimientosList />} />
);