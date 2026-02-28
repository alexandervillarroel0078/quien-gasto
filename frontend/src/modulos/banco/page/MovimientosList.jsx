//src\modulos\banco\page\MovimientoList.jsx
import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import MovimientoForm from "../components/MovimientoForm";

import {
  listarMovimientos,
  obtenerMovimiento,
  crearMovimiento,
  editarMovimiento,
  anularMovimiento,
} from "../../../api/banco/movimiento";

export default function MovimientosList() {
  // ======================
  // Estados
  // ======================
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const [q, setQ] = useState("");

  const [anio, setAnio] = useState("");
  const [mes, setMes] = useState("");
  const [semanaMes, setSemanaMes] = useState("");
  // ======================
  // Cargar
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarMovimientos(
        p,
        size,
        q,
        null,
        anio || null,
        mes || null,
        semanaMes || null
      );
      setItems(res.data.items);
      setPage(res.data.page);
      setPages(res.data.pages);
    },
    [page, size, q, anio, mes, semanaMes]
  );

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  useEffect(() => {
    const t = setTimeout(() => cargar(1), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    cargar(1);
  }, [anio, mes, semanaMes]);

  useEffect(() => {
    setSemanaMes("");
  }, [anio, mes]);
  // ======================
  // Acciones
  // ======================
  const nuevo = () => {
    setActual(null);
    setModo("crear");
    setMostrarForm(true);
  };

  const ver = async id => {
    const res = await obtenerMovimiento(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async id => {
    const res = await obtenerMovimiento(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async data => {
    if (modo === "crear") {
      await crearMovimiento(data);
    } else {
      await editarMovimiento(actual.id, data);
    }
    setMostrarForm(false);
    cargar(page);
  };

  const anular = async id => {
    if (!window.confirm("¿Anular movimiento?")) return;
    await anularMovimiento(id);
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
    {
      key: "fecha",
      label: "Fecha",
    },
    {
      key: "cuenta",
      label: "Cuenta",
      render: m => m.cuenta?.nombre || "-",
    },
    {
      key: "tipo",
      label: "Tipo",
    },
    {
      key: "monto",
      label: "Monto",
    },
    {
      key: "categoria",
      label: "Categoría",
      render: m => m.categoria?.nombre || "-",
    },
    {
      key: "estado",
      label: "Estado",
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="💳 Movimientos"
        actionLabel="+ Nuevo movimiento"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por concepto..."
      />
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "15px",
        flexWrap: "wrap"
      }}>

        {/* Año */}
        <select
          value={anio}
          onChange={e => setAnio(e.target.value)}
          style={{ padding: "6px 10px" }}
        >
          <option value="">Año</option>
          {[2024, 2025, 2026, 2027].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* Mes */}
        <select
          value={mes}
          onChange={e => setMes(e.target.value)}
          style={{ padding: "6px 10px" }}
        >
          <option value="">Mes</option>
          {[
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ].map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>

        {/* Semana */}
        <select
          value={semanaMes}
          onChange={e => setSemanaMes(e.target.value)}
          disabled={!anio || !mes}
          style={{ padding: "6px 10px" }}
        >
          <option value="">Semana del mes</option>
          <option value="1">Semana 1 (1-7)</option>
          <option value="2">Semana 2 (8-14)</option>
          <option value="3">Semana 3 (15-21)</option>
          <option value="4">Semana 4 (22-28)</option>
          <option value="5">Semana 5 (29-fin)</option>
        </select>

        {/* Botón limpiar */}
        <Button
          size="sm"
          onClick={() => {
            setAnio("");
            setMes("");
            setSemanaMes("");
          }}
        >
          Limpiar filtros
        </Button>

      </div>
      <Table
        columns={columns}
        data={items}
        onRowClick={m => ver(m.id)}
        renderActions={m => (
          <ActionMenu
            primaryAction={
              <Button size="sm" onClick={() => ver(m.id)}>
                Ver
              </Button>
            }
            items={[
              {
                label: "Editar",
                icon: "✏️",
                onClick: () => editar(m.id),
              },
              m.estado !== "ANULADO" && {
                label: "Anular",
                icon: "🗑",
                danger: true,
                onClick: () => anular(m.id),
              },
            ].filter(Boolean)}
          />
        )}
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
            ? "➕ Nuevo Movimiento"
            : modo === "editar"
              ? "✏️ Editar Movimiento"
              : "👁️ Detalle Movimiento"
        }
        width={420}
      >
        <MovimientoForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}