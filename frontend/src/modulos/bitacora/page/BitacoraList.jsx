import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Table from "../../../shared/components/Table";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import { listarBitacora } from "../../../api/bitacora";

export default function BitacoraList() {
  // ======================
  // Estados
  // ======================
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const [q, setQ] = useState("");

  // ======================
  // Cargar
  // ======================
  const cargar = useCallback(
    async (p = page) => {
      const res = await listarBitacora(p, size, q);
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
      render: b => new Date(b.fecha).toLocaleString(),
    },
    {
      key: "entidad",
      label: "Entidad",
    },
    {
      key: "accion",
      label: "Acción",
    },
    {
      key: "descripcion",
      label: "Descripción",
    },
    {
      key: "usuario_id",
      label: "Usuario",
      render: b => `ID ${b.usuario_id ?? "-"}`,
    },
  ];

  // ======================
  // Render
  // ======================
  return (
    <Layout>
      <PageHeader
        title="📜 Bitácora"
        searchValue={q}
        onSearch={setQ}
        searchPlaceholder="Buscar por entidad o acción..."
      />

      <Table
        columns={columns}
        data={items}
      />

      <Pagination
        page={page}
        pages={pages}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => Math.min(pages, p + 1))}
      />
    </Layout>
  );
}
