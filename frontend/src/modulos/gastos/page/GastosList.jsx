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
  eliminarGasto,
} from "../../../api/gasto";

import useAuth from "../../../auth/useAuth";

export default function GastosList() {
  const { user } = useAuth(); // 👈 USUARIO LOGUEADO

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
      const res = await listarGastos(p, size, q);
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

  const eliminar = async id => {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    await eliminarGasto(id);
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
      key: "concepto",
      label: "Concepto",
    },
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
        searchPlaceholder="Buscar por concepto..."
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={g => ver(g.id)}
        renderActions={g => {
          const esMio = g.usuario_login_id === user.usuario_id;


          return (
            <ActionMenu
              primaryAction={
                <Button size="sm" onClick={() => ver(g.id)}>
                  Ver
                </Button>
              }
              items={[
                ...(esMio
                  ? [
                      {
                        label: "Editar",
                        icon: "✏️",
                        onClick: () => editar(g.id),
                      },
                      {
                        label: "Eliminar",
                        icon: "🗑",
                        danger: true,
                        onClick: () => eliminar(g.id),
                      },
                    ]
                  : []),
              ]}
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
