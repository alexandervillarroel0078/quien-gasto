// src/modulos/aportes/page/AportesList.jsx
import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import GastoForm from "../components/GastoForm";
import {
  listarGastos,
  obtenerGasto,
  crearGasto,
  actualizarGasto,
  anularGasto,
} from "../../../api/gasto";

import { lookupPersonas } from "../../../api/persona";
import { lookupPeriodos } from "../../../api/periodo";
import useAuth from "../../../auth/useAuth";

export default function GastosList() {
  const { user } = useAuth();

  // ======================
  // Estados
  // ======================
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear"); // crear | editar | ver

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const [q, setQ] = useState("");
  const [personaId, setPersonaId] = useState(null);
  const [periodoId, setPeriodoId] = useState(null);

  const [personas, setPersonas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  // ======================
  // Lookups
  // ======================
  useEffect(() => {
    lookupPersonas().then(res => setPersonas(res.data));
    lookupPeriodos().then(res => setPeriodos(res.data));
  }, []);

  // ======================
  // Cargar gastos
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarGastos(
        p,
        size,
        q,
        periodoId, // 👈 periodo_id
        personaId  // 👈 persona_id
      );

      setItems(res.data.items);
      setPage(res.data.page);
      setPages(res.data.pages);
    },
    [page, size, q, personaId, periodoId]
  );

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  // reset automático al cambiar filtros
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      cargar(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, personaId, periodoId]);

  // ======================
  // Acciones
  // ======================
  const nuevo = () => {
    setActual(null);
    setModo("crear");
    setMostrarForm(true);
  };

  const ver = async id => {
    const res = await obtenerGasto(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async id => {
    const res = await obtenerGasto(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async data => {
    if (modo === "crear") {
      await crearGasto(data);
    } else if (modo === "editar") {
      await actualizarGasto(actual.id, data);
    }

    setMostrarForm(false);
    setActual(null);
    cargar(page);
  };

  const anular = async id => {
    if (!window.confirm("¿Anular este gasto?")) return;
    await anularGasto(id);
    cargar(page);
  };

  // ======================
  // Columnas
  // ======================
  const columns = [
    {
      key: "index",
      label: "#",
      render: (_, i) => i + 1 + (page - 1) * size,
    },
    { key: "fecha", label: "Fecha" },
    { key: "concepto", label: "Concepto" },
    {
      key: "persona",
      label: "Persona",
      render: g => g.persona?.nombre || "-",
    },
    {
      key: "monto",
      label: "Monto",
      render: g => `Bs ${g.monto}`,
    },
    {
      key: "estado",
      label: "Estado",
      render: g => (g.estado === "ANULADO" ? "Anulado" : "Activo"),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="💸 Gastos"
        actionLabel="+ Nuevo gasto"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por concepto o persona..."
      />

      {/* Filtros */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {/* Persona */}
        <select
          value={personaId ?? ""}
          onChange={e =>
            setPersonaId(e.target.value ? Number(e.target.value) : null)
          }
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
          <option value="">Todas las personas</option>
          {personas.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Periodo */}
        <select
          value={periodoId ?? ""}
          onChange={e =>
            setPeriodoId(e.target.value ? Number(e.target.value) : null)
          }
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
          {periodos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        data={items}
        onRowClick={g => ver(g.id)}
        renderActions={g => {
          const esMio = g.usuario_login_id === user?.usuario_id;
          return (
            <ActionMenu
              primaryAction={
                <Button size="sm" onClick={() => ver(g.id)}>
                  Ver
                </Button>
              }
              items={
                esMio && g.estado !== "ANULADO"
                  ? [
                      {
                        label: "Editar",
                        icon: "✏️",
                        onClick: () => editar(g.id),
                      },
                      {
                        label: "Anular",
                        icon: "🚫",
                        danger: true,
                        onClick: () => anular(g.id),
                      },
                    ]
                  : []
              }
            />
          );
        }}
      />

      <Pagination
        page={page}
        pages={pages}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => Math.min(pages, p + 1))}
      />

      <Drawer
        open={mostrarForm}
        onClose={() => setMostrarForm(false)}
        title={
          modo === "crear"
            ? "➕ Nuevo Gasto"
            : modo === "editar"
            ? "✏️ Editar Gasto"
            : "👁️ Detalle Gasto"
        }
        width={400}
      >
        <GastoForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}