//src\routers\categoriamovimiento.routes.jsx
import { Route } from "react-router-dom";
import CategoriaMovimiento from "../modulos/banco/page/CategoriaMovimientoList";

export default (
  <Route
    path="/categorias-movimiento"
    element={<CategoriaMovimiento />}
  />
);