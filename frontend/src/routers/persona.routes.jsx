// src/routers/persona.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import PersonasList from "../modulos/persona/page/PersonasList";

export default (
  <Route element={<RoleRoute />}>
    <Route path="/personas" element={<PersonasList />} />
  </Route>
);
