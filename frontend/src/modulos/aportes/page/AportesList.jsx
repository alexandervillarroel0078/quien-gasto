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
  eliminarAporte,
} from "../../../api/aporte";

export default function AportesList() {
  // ======================
  // Estados
  // ======================
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear"); // crear | ver

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const [q, setQ] = useState("");

  // ======================
  // Cargar
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarAportes(p, size, q);
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

  const ver = aporte => {
    setActual(aporte);
    setModo("ver");
    setMostrarForm(true);
  };

  const guardar = async data => {
    await crearAporte(data);
    setMostrarForm(false);
    cargar(page);
  };

  const eliminar = async id => {
    if (!window.confirm("¿Eliminar este aporte?")) return;
    await eliminarAporte(id);
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
      key: "monto",
      label: "Monto",
      render: a => `Bs ${a.monto}`,
    },
    {
      key: "nota",
      label: "Nota",
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
        searchPlaceholder="Buscar por nota..."
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={a => ver(a)}
        renderActions={a => (
          <ActionMenu
            primaryAction={
              <Button size="sm" onClick={() => ver(a)}>
                Ver
              </Button>
            }
            items={[
              {
                label: "Eliminar",
                icon: "🗑",
                danger: true,
                onClick: () => eliminar(a.id),
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
        title={
          modo === "crear"
            ? "➕ Nuevo Aporte"
            : "👁️ Detalle Aporte"
        }
        width={360}
      >
        <AporteForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton="Guardar"
        />
      </Drawer>
    </Layout>
  );
}
