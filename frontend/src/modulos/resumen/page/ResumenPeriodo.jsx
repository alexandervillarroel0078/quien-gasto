//src/modulos/resumen/page/ResumenPeriodo.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "../../../layouts/Layout";
import Table from "../../../shared/components/Table";
import PageHeader from "../../../shared/components/PageHeader";
import Select from "../../../shared/components/form/Select";

import { listarPeriodos } from "../../../api/periodo";
import { resumenPorPeriodo, resumenGeneral } from "../../../api/resumen";

export default function ResumenPeriodo() {
  const { periodoId } = useParams();
  const navigate = useNavigate();

  const [periodos, setPeriodos] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(
    periodoId ? Number(periodoId) : ""
  );
  const [modoResumen, setModoResumen] = useState("periodo"); // 👈 NUEVO
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
        navigate(`/resumen/periodo/${lista[0].id}`, { replace: true });
      }
    };

    cargarPeriodos();
  }, []);

  // ======================
  // Sincronizar URL → estado
  // ======================
  useEffect(() => {
    if (periodoId) {
      setPeriodoActual(Number(periodoId));
    }
  }, [periodoId]);

  // ======================
  // Cargar resumen
  // ======================
  useEffect(() => {
    const cargar = async () => {
      if (modoResumen === "periodo" && !periodoActual) return;

      const res =
        modoResumen === "periodo"
          ? await resumenPorPeriodo(periodoActual)
          : await resumenGeneral();

      setItems(res.data || []);
    };

    cargar();
  }, [modoResumen, periodoActual]);

  // ======================
  // Columnas
  // ======================
  const columns = [
    { key: "nombre", label: "Persona" },
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
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginBottom: 12,
  }}
>
  {/* Select período */}
  <Select
    value={periodoActual}
    onChange={e => {
      const id = Number(e.target.value);
      setPeriodoActual(id);
      navigate(`/resumen/periodo/${id}`);
    }}
    disabled={modoResumen !== "periodo"}
    style={{
      minWidth: 220,
      height: 36,
    }}
  >
    {periodos.map(p => (
      <option key={p.id} value={p.id}>
        {p.nombre}
      </option>
    ))}
  </Select>

  {/* Select modo */}
  <Select
    value={modoResumen}
    onChange={e => setModoResumen(e.target.value)}
    style={{
      minWidth: 180,
      height: 36,
    }}
  >
    <option value="periodo">📅 Por período</option>
    <option value="acumulado">📊 Acumulado</option>
  </Select>
</div>
      <PageHeader
        title="📊 Resumen"

        rightContent={
          <>
          </>
        }
      />

      <Table columns={columns} data={items} />
    </Layout>
  );
}