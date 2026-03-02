// src/modulos/banco/page/reporte_cuentas.jsx
import { useEffect, useState } from "react";
import Layout from "../../../layouts/Layout";
import PageHeader from "../../../shared/components/PageHeader";
import Select from "../../../shared/components/form/Select";

import {
  getResumenCuentas,
  getMovimientosPorMes,
  getSaldoPorCuenta,
} from "../../../api/banco/reporte_cuentas";

import { lookupCuentas } from "../../../api/banco/cuenta";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function ReporteCuentas() {
  const [resumen, setResumen] = useState(null);
  const [movimientosMes, setMovimientosMes] = useState([]);
  const [saldoCuenta, setSaldoCuenta] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  const [anio, setAnio] = useState(new Date().getFullYear());
  const [cuentaId, setCuentaId] = useState("");
  const [mes, setMes] = useState("");
  const [moneda, setMoneda] = useState("BOB"); // 🔥 NUEVO

  // =========================
  // CARGAR CUENTAS
  // =========================
  useEffect(() => {
    const cargarCuentas = async () => {
      const r = await lookupCuentas();
      setCuentas(r.data);
    };
    cargarCuentas();
  }, []);

  // =========================
  // CARGAR REPORTES
  // =========================
  useEffect(() => {
    const cargar = async () => {
      const r1 = await getResumenCuentas(
        anio,
        mes ? Number(mes) : null,
        cuentaId ? Number(cuentaId) : null,
        moneda
      );
      setResumen(r1.data);

      const r2 = await getMovimientosPorMes(
        anio,
        mes ? Number(mes) : null,
        cuentaId ? Number(cuentaId) : null,
        moneda
      );
      setMovimientosMes(r2.data);

      const r3 = await getSaldoPorCuenta(moneda);
      setSaldoCuenta(r3.data);
    };

    cargar();
  }, [anio, mes, cuentaId, moneda]);

  const simbolo = moneda === "USD" ? "US$ " : "Bs ";

  return (
    <Layout>
      <PageHeader title="📊 Reporte Cuentas" />

      {/* ========================= */}
      {/* FILTROS */}
      {/* ========================= */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <Select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>

        <Select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Todos los meses</option>
          {[
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ].map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </Select>

        <Select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)}>
          <option value="">Todas las cuentas</option>
          {cuentas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>

        {/* 🔥 NUEVO SELECT MONEDA */}
        <Select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
          <option value="BOB">BOB</option>
          <option value="USD">USD</option>
        </Select>
      </div>

      {/* ========================= */}
      {/* RESUMEN */}
      {/* ========================= */}
      {resumen && (
        <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
          <Card titulo="Ingresos" valor={resumen.ingresos} color="#16a34a" moneda={moneda} />
          <Card titulo="Egresos" valor={resumen.egresos} color="#dc2626" moneda={moneda} />
          <Card titulo="Saldo" valor={resumen.saldo} color="#2563eb" moneda={moneda} />
        </div>
      )}

      {/* ========================= */}
      {/* INGRESOS VS EGRESOS */}
      {/* ========================= */}
      <div style={{ height: 300, marginBottom: 40 }}>
        <h3>Ingresos vs Egresos ({anio})</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={movimientosMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis
              width={100}
              tickFormatter={(value) =>
                simbolo +
                new Intl.NumberFormat("es-BO", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value) =>
                simbolo +
                new Intl.NumberFormat("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(value)
              }
            />
            <Line type="monotone" dataKey="INGRESO" stroke="#16a34a" />
            <Line type="monotone" dataKey="EGRESO" stroke="#dc2626" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ========================= */}
      {/* SALDO POR CUENTA */}
      {/* ========================= */}
      <div style={{ height: 300 }}>
        <h3>Saldo por Cuenta</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={saldoCuenta}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cuenta" />
            <YAxis
              width={100}
              tickFormatter={(value) =>
                simbolo +
                new Intl.NumberFormat("es-BO").format(value)
              }
            />
            <Tooltip
              formatter={(value) =>
                simbolo +
                new Intl.NumberFormat("es-BO", {
                  minimumFractionDigits: 2,
                }).format(value)
              }
            />
            <Bar dataKey="saldo" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

// =========================
// CARD RESUMEN
// =========================
function Card({ titulo, valor, color, moneda }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 12,
        background: "#1f2937",
        color: "white",
      }}
    >
      <h4>{titulo}</h4>
      <h2 style={{ color }}>
        {new Intl.NumberFormat("es-BO", {
          style: "currency",
          currency: moneda,
          minimumFractionDigits: 2,
        }).format(Number(valor || 0))}
      </h2>
    </div>
  );
}