// frontend/src/api/prestamo.js
import api from "./api";


// ===============================
// CREAR PRESTAMO
// ===============================
export const crearPrestamo = (data) =>
  api.post("/prestamos/", data);


// ===============================
// REGISTRAR PAGO
// ===============================
export const registrarPagoPrestamo = (prestamo_id, data) =>
  api.post(`/prestamos/${prestamo_id}/pagos`, data);

// ===============================
// RESUMEN DE DEUDAS
// ===============================
export const resumenDeudas = () =>
  api.get("/prestamos/resumen");


// ===============================
// HISTORIAL DE DEUDA
// ===============================
export const historialDeuda = (deudor_id, acreedor_id) =>
  api.get(`/prestamos/historial/${deudor_id}/${acreedor_id}`);