// frontend/src/api/resumen.js
import api from "./api";

// =======================
// RESUMEN POR PERIODO
// =======================
export const resumenPorPeriodo = (periodoId) =>
  api.get(`/resumen/periodo/${periodoId}`);

// =======================
// RESUMEN GENERAL (NUEVO)
// =======================
export const resumenGeneral = () =>
  api.get("/resumen/general");