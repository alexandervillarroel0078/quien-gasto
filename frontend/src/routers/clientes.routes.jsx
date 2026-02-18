// src/routers/clientes.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import ClientesList from "../modulos/clientes/page/ClientesList";

export default (
  <Route element={<RoleRoute roles={["ADMIN"]} />}>
    <Route path="/clientes" element={<ClientesList />} />
  </Route>
);
