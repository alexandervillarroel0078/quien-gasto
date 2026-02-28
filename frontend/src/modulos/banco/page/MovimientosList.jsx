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

  // ======================
  // Cargar
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarMovimientos(p, size, q);
      setItems(res.data.items);
      setPage(res.data.page);
      setPages(res.data.pages);
    },
    [page, size, q]
  );

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  useEffect(() => {
    const t = setTimeout(() => cargar(1), 300);
    return () => clearTimeout(t);
  }, [q]);

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