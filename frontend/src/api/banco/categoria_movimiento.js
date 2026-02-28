// src\api\banco\categoria_movimiento.js
import api from "../api";

export const listarCategoriasMovimiento = (page = 1, size = 20, q = "") =>
  api.get("/categorias-movimiento/", { params: { page, size, q } });

export const obtenerCategoriaMovimiento = id =>
  api.get(`/categorias-movimiento/${id}`);

export const crearCategoriaMovimiento = data =>
  api.post("/categorias-movimiento/", data);

export const editarCategoriaMovimiento = (id, data) =>
  api.put(`/categorias-movimiento/${id}`, data);

export const anularCategoriaMovimiento = id =>
  api.patch(`/categorias-movimiento/${id}/anular`);