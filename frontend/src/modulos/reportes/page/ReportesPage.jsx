import { useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import PageHeader from "../../../shared/components/PageHeader";
import Select from "../../../shared/components/form/Select";
import Table from "../../../shared/components/Table";

import { listarPeriodos } from "../../../api/periodo";
import {
  reporteBalance,
  reportePersonas,
  reporteGastosCategorias,
  reportePeriodosComparar,
} from "../../../api/reportes";

const styles = {
  card: {
    background: "#1a1b23",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    border: "1px solid #2b2d33",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  },
  stat: {
    textAlign: "center",
    padding: 12,
    background: "#111217",
    borderRadius: 8,
  },
  statLabel: { fontSize: 12, color: "#8a8b95", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 600 },
  sectionTitle: { marginBottom: 12, fontSize: 16, fontWeight: 600 },
};

export default function ReportesPage() {
  const [periodos, setPeriodos] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [balance, setBalance] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [compararIds, setCompararIds] = useState("");
  const [compararData, setCompararData] = useState([]);

  useEffect(() => {
    listarPeriodos(1, 200).then((r) => {
      const list = r.data.items || [];
      setPeriodos(list);
      if (!periodoId && list.length) setPeriodoId(String(list[0].id));
    });
  }, []);

  useEffect(() => {
    const id = periodoId ? Number(periodoId) : null;
    reporteBalance(id).then((r) => setBalance(r.data));
    reportePersonas(id).then((r) => setPersonas(r.data || []));
    reporteGastosCategorias(id).then((r) => setCategorias(r.data || []));
  }, [periodoId]);

  const runComparar = () => {
    const ids = compararIds.split(",").map((x) => x.trim()).filter(Boolean).map(Number);
    if (ids.length === 0) return;
    reportePeriodosComparar(ids).then((r) => setCompararData(r.data || []));
  };

  return (
    <Layout>
      <Select
        value={periodoId}
        onChange={(e) => setPeriodoId(e.target.value)}
        style={{
          minWidth: 220,
          height: 36,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #2b2d33",
          background: "#111217",
          color: "#ffffff",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <option value="">Todos los periodos</option>
        {periodos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </Select>

      <PageHeader
        title="📊 Reportes"

      />

      {balance && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Balance</div>
          <div style={styles.grid}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Total aportes</div>
              <div style={{ ...styles.statValue, color: "#27ae60" }}>
                Bs {Number(balance.total_aportes).toFixed(2)}
              </div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Total gastos</div>
              <div style={{ ...styles.statValue, color: "#e74c3c" }}>
                Bs {Number(balance.total_gastos).toFixed(2)}
              </div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Balance</div>
              <div
                style={{
                  ...styles.statValue,
                  color: balance.balance >= 0 ? "#27ae60" : "#e74c3c",
                }}
              >
                Bs {Number(balance.balance).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Por persona</div>
        <Table
          columns={[
            { key: "nombre", label: "Persona" },
            {
              key: "total_aportes",
              label: "Aportes",
              render: (r) => `Bs ${Number(r.total_aportes).toFixed(2)}`,
            },
            {
              key: "total_gastos",
              label: "Gastos",
              render: (r) => `Bs ${Number(r.total_gastos).toFixed(2)}`,
            },
            {
              key: "balance",
              label: "Balance",
              render: (r) => (
                <span
                  style={{
                    color: r.balance >= 0 ? "#27ae60" : "#e74c3c",
                    fontWeight: 600,
                  }}
                >
                  Bs {Number(r.balance).toFixed(2)}
                </span>
              ),
            },
          ]}
          data={personas}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Gastos por categoría</div>
        <Table
          columns={[
            { key: "categoria_nombre", label: "Categoría", render: (r) => r.categoria_nombre || "Sin categoría" },
            {
              key: "total",
              label: "Total",
              render: (r) => `Bs ${Number(r.total).toFixed(2)}`,
            },
            { key: "cantidad", label: "Cant. movimientos" },
          ]}
          data={categorias}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Comparar periodos</div>
        <p style={{ fontSize: 13, color: "#8a8b95", marginBottom: 8 }}>
          Ingrese IDs de periodos separados por coma (ej: 1,2,3)
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={compararIds}
            onChange={(e) => setCompararIds(e.target.value)}
            placeholder="1, 2, 3"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #2b2d33",
              background: "#111217",
              color: "#fff",
            }}
          />
          <button
            onClick={runComparar}
            style={{
              padding: "8px 16px",
              background: "#ff6a2c",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Comparar
          </button>
        </div>
        {compararData.length > 0 && (
          <Table
            columns={[
              { key: "periodo_nombre", label: "Periodo" },
              {
                key: "total_aportes",
                label: "Aportes",
                render: (r) => `Bs ${Number(r.total_aportes).toFixed(2)}`,
              },
              {
                key: "total_gastos",
                label: "Gastos",
                render: (r) => `Bs ${Number(r.total_gastos).toFixed(2)}`,
              },
              {
                key: "balance",
                label: "Balance",
                render: (r) => (
                  <span
                    style={{
                      color: r.balance >= 0 ? "#27ae60" : "#e74c3c",
                      fontWeight: 600,
                    }}
                  >
                    Bs {Number(r.balance).toFixed(2)}
                  </span>
                ),
              },
            ]}
            data={compararData}
          />
        )}
      </div>
    </Layout>
  );
}
