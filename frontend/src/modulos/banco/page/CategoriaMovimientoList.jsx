//src\modulos\banco\page\CategoriaMovimiento.jsx
import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Button from "../../../shared/components/Button";
import Table from "../../../shared/components/Table";
import Drawer from "../../../shared/components/Drawer";
import ActionMenu from "../../../shared/components/ActionMenu";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import CategoriaMovimientoForm from "../components/CategoriaMovimientoForm";

import {
  listarCategoriasMovimiento,
  obtenerCategoriaMovimiento,
  crearCategoriaMovimiento,
  editarCategoriaMovimiento,
  anularCategoriaMovimiento,
} from "../../../api/banco/categoria_movimiento";

export default function CategoriaMovimientoList() {
  const [items, setItems] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [actual, setActual] = useState(null);
  const [modo, setModo] = useState("crear");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;
  const [q, setQ] = useState("");

  const cargar = useCallback(async (p = page) => {
    const res = await listarCategoriasMovimiento(p, size, q);
    setItems(res.data.items);
    setPage(res.data.page);
    setPages(res.data.pages);
  }, [page, size, q]);

  useEffect(() => { cargar(page); }, [page, cargar]);

  useEffect(() => {
    const t = setTimeout(() => cargar(1), 300);
    return () => clearTimeout(t);
  }, [q]);

  const nuevo = () => {
    setActual(null);
    setModo("crear");
    setMostrarForm(true);
  };

  const ver = async id => {
    const res = await obtenerCategoriaMovimiento(id);
    setActual(res.data);
    setModo("ver");
    setMostrarForm(true);
  };

  const editar = async id => {
    const res = await obtenerCategoriaMovimiento(id);
    setActual(res.data);
    setModo("editar");
    setMostrarForm(true);
  };

  const guardar = async data => {
    if (modo === "crear") {
      await crearCategoriaMovimiento(data);
    } else {
      await editarCategoriaMovimiento(actual.id, data);
    }
    setMostrarForm(false);
    cargar(page);
  };

  const baja = async id => {
    if (!window.confirm("¿Desactivar categoría?")) return;
    await anularCategoriaMovimiento(id);
    cargar(page);
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "tipo", label: "Tipo" },
    {
      key: "activo",
      label: "Estado",
      render: c => (c.activo ? "Activo" : "Inactivo"),
    },
  ];

  return (
    <Layout>
      <PageHeader
        title="📂 Categorías Movimiento"
        actionLabel="+ Nueva categoría"
        onAction={nuevo}
        searchValue={q}
        onSearch={setQ}
      />

      <Table
        columns={columns}
        data={items}
        onRowClick={c => ver(c.id)}
        renderActions={c => (
          <ActionMenu
            items={[
              { label: "Editar", onClick: () => editar(c.id) },
              { label: "Desactivar", danger: true, onClick: () => baja(c.id) },
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
        title="Categoría Movimiento"
        width={420} 
      >
        <CategoriaMovimientoForm
          initialData={actual}
          onSubmit={guardar}
          soloLectura={modo === "ver"}
          textoBoton={modo === "crear" ? "Guardar" : "Actualizar"}
        />
      </Drawer>
    </Layout>
  );
}