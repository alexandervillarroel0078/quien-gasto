//  frontend/src/api/bitacora.js
import api from "./api";

// =======================
// LISTAR (paginado)
// =======================
export const listarGastos = (page = 1, size = 20, q = "", periodo_id = null) =>
  api.get("/gastos", {
    params: { page, size, q, periodo_id },
  });

// =======================
// OBTENER POR ID
// =======================
export const obtenerGasto = (id) =>
  api.get(`/gastos/${id}`);

// =======================
// CREAR
// =======================
export const crearGasto = (data) =>
  api.post("/gastos", data);

// =======================
// ACTUALIZAR
// =======================
export const actualizarGasto = (id, data) =>
  api.put(`/gastos/${id}`, data);

// =======================
// ELIMINAR
// =======================
export const eliminarGasto = (id) =>
  api.delete(`/gastos/${id}`);
