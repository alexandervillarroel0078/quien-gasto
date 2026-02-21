import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import CategoriaGastoForm from "../components/CategoriaGastoForm";
import {
  listarCategoriasGasto,
  obtenerCategoriaGasto,
  crearCategoriaGasto,
  actualizarCategoriaGasto,
  desactivarCategoriaGasto,
  activarCategoriaGasto,
} from "../../../api/categoriaGasto";

export default function CategoriasGastoList() {
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;
  const [soloActivas, setSoloActivas] = useState(true);
  const [q, setQ] = useState("");

  const cargar = useCallback(
    async (p = page) => {
      const res = await listarCategoriasGasto(p, size, soloActivas, q);
      setItems(res.data.items);
      setPage(res.data.page);
      setPages(res.data.pages);
    },
    [page, size, soloActivas, q]
  );

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

  useEffect(() => {
    const t = setTimeout(() => cargar(1), 300);
    return () => clearTimeout(t);
  }, [q, soloActivas]);

  const nuevo = () => {
    setActual(null);
    setModo("crear");
    setMostrarForm(true);
  };

  const ver = async (id) => {
    const res = await obtenerCategoriaGasto(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async (id) => {
    const res = await obtenerCategoriaGasto(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async (data) => {
    if (modo === "crear") {
      await crearCategoriaGasto(data);
    } else {
      await actualizarCategoriaGasto(actual.id, data);
    }
    setMostrarForm(false);
    cargar(page);
  };

  const desactivar = async (id) => {
    if (!window.confirm("¿Desactivar esta categoría?")) return;
    await desactivarCategoriaGasto(id);
    cargar(page);
  };

  const activar = async (id) => {
    await activarCategoriaGasto(id);
    cargar(page);
  };

  const columns = [
    {
      key: "index",
      label: "#",
      render: (_, i) => i + 1 + (page - 1) * size,
    },
    { key: "nombre", label: "Nombre" },
    {
      key: "activo",
      label: "Estado",
      render: (c) => (c.activo ? "Activa" : "Inactiva"),
    },
  ];

  return (
    <Layout>
      <PageHeader
        title="📁 Categorías de gasto"
        actionLabel="+ Nueva categoría"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar categoría..."
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={(c) => ver(c.id)}
        renderActions={(c) => (
          <ActionMenu
            primaryAction={
              <Button size="sm" onClick={() => ver(c.id)}>
                Ver
              </Button>
            }
            items={[
              {
                label: "Editar",
                icon: "✏️",
                onClick: () => editar(c.id),
              },
              c.activo
                ? {
                    label: "Desactivar",
                    icon: "🗑",
                    danger: true,
                    onClick: () => desactivar(c.id),
                  }
                : {
                    label: "Activar",
                    icon: "✅",
                    onClick: () => activar(c.id),
                  },
            ]}
          />
        )}
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
            ? "➕ Nueva categoría"
            : modo === "editar"
            ? "✏️ Editar categoría"
            : "👁️ Detalle categoría"
        }
        width={380}
      >
        <CategoriaGastoForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}
