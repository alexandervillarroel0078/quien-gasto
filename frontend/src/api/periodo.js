// frontend/src/api/periodo.js
import api from "./api";

// =======================
// LISTAR
// =======================
export const listarPeriodos = (page = 1, size = 20) =>
  api.get("/periodos/", { params: { page, size } });

// =======================
// OBTENER
// =======================
export const obtenerPeriodo = id =>
  api.get(`/periodos/${id}`);

// =======================
// CREAR
// =======================
export const crearPeriodo = data =>
  api.post("/periodos/", data);

// =======================
// CERRAR
// =======================
export const cerrarPeriodo = id =>
  api.post(`/periodos/${id}/cerrar`);
