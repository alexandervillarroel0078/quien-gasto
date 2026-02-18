import { useCallback, useEffect, useState } from "react";

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
  crearPeriodo,
  cerrarPeriodo,
} from "../../../api/periodo";

export default function PeriodosList() {
  // ======================
  // Estados
  // ======================
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  // ======================
  // Cargar
  // ======================
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

  // ======================
  // Acciones
  // ======================
  const nuevo = () => {
    setMostrarForm(true);
  };

  const guardar = async data => {
    await crearPeriodo(data);
    setMostrarForm(false);
    cargar(1);
  };

  const cerrar = async id => {
    if (!window.confirm("¿Cerrar este periodo?")) return;
    await cerrarPeriodo(id);
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
        renderActions={p => (
          <ActionMenu
            primaryAction={
              <Button size="sm" onClick={() => cerrar(p.id)} disabled={p.cerrado}>
                Cerrar
              </Button>
            }
            items={[
              {
                label: "Cerrar periodo",
                icon: "🔒",
                danger: true,
                disabled: p.cerrado,
                onClick: () => cerrar(p.id),
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
        title="➕ Nuevo Periodo"
        width={360}
      >
        <PeriodoForm
          onSubmit={guardar}
          textoBoton="Crear periodo"
        />
      </Drawer>
    </Layout>
  );
}
