// frontend/src/api/resumen.js
import api from "./api";

// =======================
// RESUMEN POR PERIODO
// =======================
export const resumenPorPeriodo = (periodoId) =>
  api.get(`/resumen/periodo/${periodoId}`);
