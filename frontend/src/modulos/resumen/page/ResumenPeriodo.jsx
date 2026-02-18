import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../../layouts/Layout";
import Table from "../../../shared/components/Table";
import PageHeader from "../../../shared/components/PageHeader";
import Select from "../../../shared/components/form/Select";

import { listarPeriodos } from "../../../api/periodo";
import { resumenPorPeriodo } from "../../../api/resumen";

export default function ResumenPeriodo() {
  const { periodoId } = useParams();

  const [periodos, setPeriodos] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(periodoId || "");
  const [items, setItems] = useState([]);

  // ======================
  // Cargar periodos
  // ======================
  useEffect(() => {
    const cargarPeriodos = async () => {
      const res = await listarPeriodos(1, 100);
      setPeriodos(res.data.items || []);
      if (!periodoActual && res.data.items?.length) {
        setPeriodoActual(res.data.items[0].id);
      }
    };
    cargarPeriodos();
  }, []);

  // ======================
  // Cargar resumen
  // ======================
  useEffect(() => {
    if (!periodoActual) return;

    const cargarResumen = async () => {
      const res = await resumenPorPeriodo(periodoActual);
      setItems(res.data);
    };

    cargarResumen();
  }, [periodoActual]);

  // ======================
  // Columnas
  // ======================
  const columns = [
    {
      key: "persona",
      label: "Persona",
      render: r => r.nombre,
    },
    {
      key: "aportes",
      label: "Aportes",
      render: r => `Bs ${r.total_aportes}`,
    },
    {
      key: "gastos",
      label: "Gastos",
      render: r => `Bs ${r.total_gastos}`,
    },
    {
      key: "balance",
      label: "Balance",
      render: r => (
        <span
          style={{
            color: r.balance < 0 ? "red" : "green",
            fontWeight: 600,
          }}
        >
          Bs {r.balance}
        </span>
      ),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="📊 Resumen por periodo"
        rightContent={
          <Select
            value={periodoActual}
            onChange={e => setPeriodoActual(e.target.value)}
            style={{ minWidth: 200 }}
          >
            {periodos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
        }
      />

      <Table columns={columns} data={items} />
    </Layout>
  );
}
