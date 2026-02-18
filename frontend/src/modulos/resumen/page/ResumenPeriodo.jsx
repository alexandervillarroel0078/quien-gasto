// frontend/src/modulos/resumen/pages/ResumenPeriodo.jsx
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
  const [periodoActual, setPeriodoActual] = useState(
    periodoId ? Number(periodoId) : ""
  );
  const [items, setItems] = useState([]);

  // ======================
  // Cargar periodos
  // ======================
  useEffect(() => {
    const cargarPeriodos = async () => {
      const res = await listarPeriodos(1, 100);
      const lista = res.data.items || [];
      setPeriodos(lista);

      if (!periodoActual && lista.length) {
        setPeriodoActual(lista[0].id);
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
      setItems(res.data || []);
    };

    cargarResumen();
  }, [periodoActual]);

  // ======================
  // Columnas
  // ======================
  const columns = [
    {
      key: "nombre",
      label: "Persona",
      render: r => r.nombre,
    },
    {
      key: "total_aportes",
      label: "Aportes",
      render: r => `Bs ${r.total_aportes.toFixed(2)}`,
    },
    {
      key: "total_gastos",
      label: "Gastos",
      render: r => `Bs ${r.total_gastos.toFixed(2)}`,
    },
    {
      key: "balance",
      label: "Balance",
      render: r => (
        <span
          style={{
            color: r.balance < 0 ? "#c0392b" : "#27ae60",
            fontWeight: 600,
          }}
        >
          Bs {r.balance.toFixed(2)}
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
            onChange={e => setPeriodoActual(Number(e.target.value))}
            style={{ minWidth: 220 }}
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
