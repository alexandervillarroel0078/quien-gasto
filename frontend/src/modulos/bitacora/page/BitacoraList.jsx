import { useCallback, useEffect, useState } from "react";

import Layout from "../../../layouts/Layout";
import Table from "../../../shared/components/Table";
import PageHeader from "../../../shared/components/PageHeader";
import Pagination from "../../../shared/components/Pagination";

import { listarBitacora } from "../../../api/bitacora";

export default function BitacoraList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const size = 20;

  const cargar = useCallback(async (p) => {
    const res = await listarBitacora(p, size);
    setItems(res.data.items);
    setPage(res.data.page);
    setPages(res.data.pages);
  }, []);

  useEffect(() => {
    cargar(page);
  }, [page, cargar]);

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
      key: "usuario",
      label: "Usuario",
      render: b => (b.usuario ? b.usuario.nombre : "-"),
    },
  ];

  return (
    <Layout>
      <PageHeader title="📜 Bitácora" />

      <Table columns={columns} data={items} />

      <Pagination
        page={page}
        pages={pages}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => Math.min(pages, p + 1))}
      />
    </Layout>
  );
}
