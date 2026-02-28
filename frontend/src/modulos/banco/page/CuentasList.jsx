// src/modulos/banco/page/CuentasList.jsx
import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import CuentaForm from "../components/CuentaForm";

import {
  listarCuentas,
  obtenerCuenta,
  crearCuenta,
  editarCuenta,
  anularCuenta,
} from "../../../api/banco/cuenta";

export default function CuentasList() {
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
      const res = await listarCuentas(p, size, q);
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
    const res = await obtenerCuenta(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async id => {
    const res = await obtenerCuenta(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async data => {
    if (modo === "crear") {
      await crearCuenta(data);
    } else {
      await editarCuenta(actual.id, data);
    }

    setMostrarForm(false);
    cargar(page);
  };

  const baja = async id => {
    if (!window.confirm("¿Desactivar cuenta?")) return;
    await anularCuenta(id);
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
    { key: "banco", label: "Banco" },
    { key: "numero_cuenta", label: "N° Cuenta" },
    { key: "tipo", label: "Tipo" },
    { key: "moneda", label: "Moneda" },
    {
      key: "activo",
      label: "Estado",
      render: c => (c.activo ? "Activa" : "Inactiva"),
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="🏦 Cuentas"
        actionLabel="+ Nueva cuenta"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por nombre o banco..."
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={c => ver(c.id)}
        renderActions={c => (
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
              c.activo && {
                label: "Desactivar",
                icon: "🗑",
                danger: true,
                onClick: () => baja(c.id),
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
            ? "➕ Nueva Cuenta"
            : modo === "editar"
            ? "✏️ Editar Cuenta"
            : "👁️ Detalle Cuenta"
        }
        width={420}
      >
        <CuentaForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}