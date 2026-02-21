import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import PeriodoForm from "../components/PeriodoForm";
import {
  listarPeriodos,
  obtenerPeriodo,
  crearPeriodo,
  actualizarPeriodo,
  cerrarPeriodo,
  reabrirPeriodo,
} from "../../../api/periodo";

export default function PeriodosList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear"); // crear | editar

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const cargar = useCallback(
    async (p = page) => {
      const res = await listarPeriodos(p, size);
      setItems(res.data.items);
      setPage(res.data.page);
      setPages(res.data.pages);
    },
    [page, size]
  );

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  const nuevo = () => {
    setActual(null);
    setModo("crear");
    setMostrarForm(true);
  };

  const editar = async (p) => {
    const res = await obtenerPeriodo(p.id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async (data) => {
    if (modo === "crear") {
      await crearPeriodo(data);
    } else {
      await actualizarPeriodo(actual.id, data);
    }
    setMostrarForm(false);
    setActual(null);
    cargar(modo === "crear" ? 1 : page);
  };

  const cerrar = async (id) => {
    if (!window.confirm("¿Cerrar este periodo?")) return;
    await cerrarPeriodo(id);
    cargar(page);
  };

  const reabrir = async (id) => {
    if (!window.confirm("¿Reabrir este periodo?")) return;
    await reabrirPeriodo(id);
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
    { key: "nombre", label: "Periodo" },
    { key: "fecha_inicio", label: "Inicio" },
    { key: "fecha_fin", label: "Fin" },
    {
      key: "cerrado",
      label: "Estado",
      render: p => (p.cerrado ? "Cerrado" : "Abierto"),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="🗓️ Periodos"
        actionLabel="+ Nuevo periodo"
        onAction={nuevo}
      />

      <Table
        columns={columns}
        data={items}
        renderActions={(p) => (
          <ActionMenu
            primaryAction={
              <Button
                size="sm"
                onClick={() => (p.cerrado ? reabrir(p.id) : cerrar(p.id))}
              >
                {p.cerrado ? "Reabrir" : "Cerrar"}
              </Button>
            }
            items={[
              {
                label: "Ver resumen",
                icon: "📊",
                onClick: () => navigate(`/resumen/periodo/${p.id}`),
              },
              {
                label: "Editar",
                icon: "✏️",
                disabled: p.cerrado,
                onClick: () => editar(p),
              },
              {
                label: p.cerrado ? "Reabrir periodo" : "Cerrar periodo",
                icon: p.cerrado ? "🔓" : "🔒",
                danger: !p.cerrado,
                disabled: false,
                onClick: () => (p.cerrado ? reabrir(p.id) : cerrar(p.id)),
              },
            ]}
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
        title={modo === "crear" ? "➕ Nuevo Periodo" : "✏️ Editar Periodo"}
        width={360}
      >
        <PeriodoForm
          initialData={actual}
          onSubmit={guardar}
          textoBoton={modo === "crear" ? "Crear periodo" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}
