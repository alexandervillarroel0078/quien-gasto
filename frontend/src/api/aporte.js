//  frontend/src/api/aporte.js
import api from "./api";

// =======================
// LISTAR (paginado)
// =======================
export const listarAportes = (page = 1, size = 20, q = "", periodo_id = null) =>
  api.get("/aportes", {
    params: { page, size, q, periodo_id },
  });

// =======================
// CREAR
// =======================
export const crearAporte = (data) =>
  api.post("/aportes", data);

// =======================
// ELIMINAR
// =======================
export const eliminarAporte = (id) =>
  api.delete(`/aportes/${id}`);
