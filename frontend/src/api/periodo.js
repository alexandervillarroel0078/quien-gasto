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
// ACTUALIZAR (PATCH)
// =======================
export const actualizarPeriodo = (id, data) =>
  api.patch(`/periodos/${id}`, data);

// =======================
// CERRAR / REABRIR
// =======================
export const cerrarPeriodo = (id) =>
  api.patch(`/periodos/${id}/cerrar`);

export const reabrirPeriodo = (id) =>
  api.patch(`/periodos/${id}/reabrir`);

// =======================
// RESUMEN DEL PERIODO
// =======================
export const resumenPeriodo = (id) =>
  api.get(`/periodos/${id}/resumen`);
