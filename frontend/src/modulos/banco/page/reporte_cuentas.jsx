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
    // =========================
    // CARGAR CUENTAS LOOKUP
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
                cuentaId ? Number(cuentaId) : null
            );
            setResumen(r1.data);

            const r2 = await getMovimientosPorMes(
                anio,
                mes ? Number(mes) : null,
                cuentaId ? Number(cuentaId) : null
            );
            setMovimientosMes(r2.data);

            const r3 = await getSaldoPorCuenta();
            setSaldoCuenta(r3.data);
        };

        cargar();
    }, [anio, mes, cuentaId]);

    return (
        <Layout>
            <PageHeader title="📊 Reporte Cuentas" />

            {/* ========================= */}
            {/* FILTROS */}
            {/* ========================= */}
            <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
                <Select value={anio} onChange={e => setAnio(Number(e.target.value))}>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                </Select>
                <Select
                    value={mes}
                    onChange={e => setMes(e.target.value)}
                >
                    <option value="">Todos los meses</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Select>
                <Select
                    value={cuentaId}
                    onChange={e => setCuentaId(e.target.value)}
                >
                    <option value="">Todas las cuentas</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </Select>
            </div>

            {/* ========================= */}
            {/* RESUMEN GENERAL */}
            {/* ========================= */}
            {resumen && (
                <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
                    <Card titulo="Ingresos" valor={resumen.ingresos} color="#16a34a" />
                    <Card titulo="Egresos" valor={resumen.egresos} color="#dc2626" />
                    <Card titulo="Saldo" valor={resumen.saldo} color="#2563eb" />
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
                                "Bs " +
                                new Intl.NumberFormat("es-BO", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(value)
                            }
                        />

                        <Tooltip
                            formatter={(value) =>
                                "Bs " +
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
                                "Bs " +
                                new Intl.NumberFormat("es-BO", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(value)
                            }
                        />

                        <Tooltip
                            formatter={(value) =>
                                "Bs " +
                                new Intl.NumberFormat("es-BO", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
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

// =================================
// CARD RESUMEN
// =================================
function Card({ titulo, valor, color }) {
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
            {/* <h2 style={{ color }}>{Number(valor || 0).toFixed(2)}</h2> */}
            <h2 style={{ color }}>
                {new Intl.NumberFormat("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    minimumFractionDigits: 2,
                }).format(Number(valor || 0))}
            </h2>
        </div>
    );
}