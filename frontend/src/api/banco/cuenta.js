// src\api\banco\cuenta.js
import api from "../api";


export const lookupCuentas = (q = "") =>
  api.get("/cuentas/lookup", {
    params: q ? { q } : {}
  });
// =========================
// LISTAR
// =========================
export const listarCuentas = (page = 1, size = 20, q = "") =>
  api.get("/cuentas/", { params: { page, size, q } });

export const obtenerCuenta = id =>
  api.get(`/cuentas/${id}`);

export const crearCuenta = data =>
  api.post("/cuentas/", data);

export const editarCuenta = (id, data) =>
  api.put(`/cuentas/${id}`, data);

export const anularCuenta = id =>
  api.patch(`/cuentas/${id}/anular`);