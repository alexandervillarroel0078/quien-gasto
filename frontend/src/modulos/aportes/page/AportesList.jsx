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
  eliminarAporte,
} from "../../../api/aporte";

import useAuth from "../../../auth/useAuth";

export default function AportesList() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear"); // crear | ver | editar

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const [q, setQ] = useState("");

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

  const eliminar = async (id) => {
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
      key: "persona",
      label: "Persona",
      render: a => a.persona?.nombre ?? "-",
    },
    { key: "fecha", label: "Fecha" },
    {
      key: "monto",
      label: "Monto",
      render: a => `Bs ${a.monto}`,
    },
    { key: "nota", label: "Nota" },
  ];

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
                esMio
                  ? [
                      {
                        label: "Editar",
                        icon: "✏️",
                        onClick: () => editar(a),
                      },
                      {
                        label: "Eliminar",
                        icon: "🗑",
                        danger: true,
                        onClick: () => eliminar(a.id),
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
