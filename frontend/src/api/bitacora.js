// frontend/src/api/bitacora.js
import api from "./api";

export const listarBitacora = (
  page = 1,
  size = 20,
  entidad = null,
  accion = null
) =>
  api.get("/bitacora", {
    params: { page, size, entidad, accion },
  });
