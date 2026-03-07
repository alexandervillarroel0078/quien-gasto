// src/modulos/prestamo/page/DeudasList.jsx
import { useEffect, useState } from "react";
import Layout from "../../../layouts/Layout";

import { resumenDeudas, crearPrestamo } from "../../../api/prestamo";

import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Drawer from "../../../shared/components/Drawer";

import PrestamoForm from "../components/PrestamoForm";

export default function DeudasList() {

  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);

    try {
      const res = await resumenDeudas();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setItems([]);
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (data) => {
    await crearPrestamo(data);
    setMostrarForm(false);
    cargar();
  };

  return (
    <Layout>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >

        <h2>💰 Deudas</h2>

        <Button
          variant="primary"
          onClick={() => setMostrarForm(true)}
        >
          + Nuevo préstamo
        </Button>

      </div>

      {/* LISTA */}
      {cargando ? (
        <p>Cargando...</p>
      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >

          {items.map((d, i) => (

            <div
              key={d.deudor_id && d.acreedor_id ? `${d.deudor_id}-${d.acreedor_id}` : i}
              onClick={() => navigate(`/deudas/${d.deudor_id}/${d.acreedor_id}`)}
              style={{
                borderRadius: 10,
                padding: 18,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >

              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {d.deudor}
              </div>

              <div style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
                debe a
              </div>

              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {d.acreedor}
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#dc2626"
                }}
              >
                Bs {Number(d.saldo).toLocaleString()}
              </div>

            </div>

          ))}

        </div>

      )}

      {/* FORMULARIO */}
      <Drawer
        open={mostrarForm}
        onClose={() => setMostrarForm(false)}
        title="➕ Nuevo préstamo"
        width={380}
      >

        <PrestamoForm
          onSubmit={guardar}
          textoBoton="Guardar"
        />

      </Drawer>

    </Layout>
  );
}