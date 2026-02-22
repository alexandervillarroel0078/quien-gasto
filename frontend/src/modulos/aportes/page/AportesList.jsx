// src/modulos/aportes/page/AportesList.jsx
import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import AporteForm from "../components/AporteForm";

import {
  listarAportes,
  crearAporte,
  actualizarAporte,
  anularAporte,
} from "../../../api/aporte";

import { lookupPersonas } from "../../../api/persona";
import { lookupPeriodos } from "../../../api/periodo"; // 👈 lookup de periodos
import useAuth from "../../../auth/useAuth";

export default function AportesList() {
  const { user } = useAuth();

  // ======================
  // Estado
  // ======================
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear"); // crear | ver | editar

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
    lookupPeriodos().then(res => setPeriodos(res.data)); // puedes usar solo_abiertos=true si quieres
  }, []);

  // ======================
  // Cargar aportes
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarAportes(
        p,
        size,
        q,
        periodoId,  // 👈 periodo_id
        personaId   // 👈 persona_id
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

  const ver = (aporte) => {
    setActual(aporte);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = (aporte) => {
    setActual(aporte);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async (data) => {
    if (modo === "crear") {
      await crearAporte(data);
    } else if (modo === "editar") {
      await actualizarAporte(actual.id, data);
    }
    setMostrarForm(false);
    setActual(null);
    cargar(page);
  };

  const anular = async (id) => {
    if (!window.confirm("¿Anular este aporte?")) return;
    await anularAporte(id);
    cargar(page);
  };

  // ======================
  // Columnas tabla
  // ======================
  const columns = [
    {
      key: "index",
      label: "#",
      render: (_, i) => i + 1 + (page - 1) * size,
    },
    {
      key: "persona",
      label: "Persona",
      render: (a) => a.persona?.nombre ?? "-",
    },
    { key: "fecha", label: "Fecha" },
    {
      key: "monto",
      label: "Monto",
      render: (a) => `Bs ${a.monto}`,
    },
    { key: "nota", label: "Nota" },
    {
      key: "estado",
      label: "Estado",
      render: (a) => (a.estado === "ANULADO" ? "Anulado" : "Activo"),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="💰 Aportes"
        actionLabel="+ Nuevo aporte"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por persona o nota..."
      />

      {/* Filtros */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {/* Persona */}
        <select
          value={personaId ?? ""}
          onChange={(e) =>
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
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Periodo */}
        <select
          value={periodoId ?? ""}
          onChange={(e) =>
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
          {periodos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        data={items}
        onRowClick={ver}
        renderActions={(a) => {
          const esMio = a.usuario_login_id === user.usuario_id;
          return (
            <ActionMenu
              primaryAction={
                <Button size="sm" onClick={() => ver(a)}>
                  Ver
                </Button>
              }
              items={
                esMio && a.estado !== "ANULADO"
                  ? [
                      {
                        label: "Editar",
                        icon: "✏️",
                        onClick: () => editar(a),
                      },
                      {
                        label: "Anular",
                        icon: "🚫",
                        danger: true,
                        onClick: () => anular(a.id),
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
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
      />

      <Drawer
        open={mostrarForm}
        onClose={() => setMostrarForm(false)}
        title={
          modo === "crear"
            ? "➕ Nuevo Aporte"
            : modo === "editar"
            ? "✏️ Editar Aporte"
            : "👁️ Detalle Aporte"
        }
        width={360}
      >
        <AporteForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}