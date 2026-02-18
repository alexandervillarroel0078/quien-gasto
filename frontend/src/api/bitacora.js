//  frontend/src/api/bitacora.js
import api from "./api";

// =======================
// LISTAR BITÁCORA
// =======================
export const listarBitacora = () =>
  api.get("/bitacora");

// =======================
// OBTENER POR ID
// =======================
export const obtenerBitacora = (id) =>
  api.get(`/bitacora/${id}`);
