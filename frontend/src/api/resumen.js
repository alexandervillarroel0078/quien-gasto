// src/api/resumen.js
import api from "./api";

// =======================
// RESUMEN POR PERIODO
// =======================
export const resumenPorPeriodo = (periodo_id) =>
  api.get(`/resumen/periodo/${periodo_id}`);
