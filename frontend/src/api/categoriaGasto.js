// frontend/src/api/categoriaGasto.js
import api from "./api";

export const listarCategoriasGasto = (page = 1, size = 20, solo_activas = true, q = "") =>
  api.get("/categorias-gasto/", { params: { page, size, solo_activas, q } });

export const obtenerCategoriaGasto = (id) =>
  api.get(`/categorias-gasto/${id}`);

export const crearCategoriaGasto = (data) =>
  api.post("/categorias-gasto/", data);

export const actualizarCategoriaGasto = (id, data) =>
  api.put(`/categorias-gasto/${id}`, data);

export const desactivarCategoriaGasto = (id) =>
  api.patch(`/categorias-gasto/${id}/desactivar`);

export const activarCategoriaGasto = (id) =>
  api.patch(`/categorias-gasto/${id}/activar`);
