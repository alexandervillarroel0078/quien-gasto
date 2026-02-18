import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import PersonaForm from "../components/PersonaForm";
import {
  listarPersonas,
  obtenerPersona,
  crearPersona,
  editarPersona,
  activarPersona,
  desactivarPersona,
} from "../../../api/persona";

export default function PersonasList() {
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

  // ======================
  // Cargar
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarPersonas(p, size, q);
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
    const res = await obtenerPersona(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async id => {
    const res = await obtenerPersona(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async data => {
    if (modo === "crear") {
      await crearPersona(data);
    } else {
      await editarPersona(actual.id, data);
    }
    setMostrarForm(false);
    cargar(page);
  };

  const baja = async id => {
    if (!window.confirm("¿Desactivar persona?")) return;
    await desactivarPersona(id);
    cargar(page);
  };

  const activar = async id => {
    await activarPersona(id);
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
    { key: "nombre", label: "Nombre" },
    {
      key: "activo",
      label: "Estado",
      render: p => (p.activo ? "Activo" : "Inactivo"),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="👥 Personas"
        actionLabel="+ Nueva persona"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por nombre..."
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={p => ver(p.id)}
        renderActions={p => (
          <ActionMenu
            primaryAction={
              <Button size="sm" onClick={() => ver(p.id)}>
                Ver
              </Button>
            }
            items={[
              {
                label: "Editar",
                icon: "✏️",
                onClick: () => editar(p.id),
              },
              p.activo
                ? {
                    label: "Desactivar",
                    icon: "🗑",
                    danger: true,
                    onClick: () => baja(p.id),
                  }
                : {
                    label: "Activar",
                    icon: "✅",
                    onClick: () => activar(p.id),
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
            ? "➕ Nueva Persona"
            : modo === "editar"
            ? "✏️ Editar Persona"
            : "👁️ Detalle Persona"
        }
        width={380}
      >
        <PersonaForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}
