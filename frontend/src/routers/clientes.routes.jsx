// src/routers/clientes.routes.jsx
import { Route } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";
import ClientesList from "../modulos/clientes/page/ClientesList";

export default (
     <Route path="/clientes" element={<ClientesList />} />
   
);
