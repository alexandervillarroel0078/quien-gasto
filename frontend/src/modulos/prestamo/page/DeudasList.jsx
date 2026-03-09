// src/modulos/prestamo/page/DeudasList.jsx
import { useEffect, useState } from "react";
import Layout from "../../../layouts/Layout";

import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Drawer from "../../../shared/components/Drawer";

import PrestamoForm from "../components/PrestamoForm";


import { resumenDeudas, crearPrestamo } from "../../../api/prestamo";
import { lookupPersonas } from "../../../api/persona";


export default function DeudasList() {

  const [meDeben, setMeDeben] = useState([]);
  const [yoDebo, setYoDebo] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [personas, setPersonas] = useState([]);
  const [personaId, setPersonaId] = useState(null);
  const [estado, setEstado] = useState("ACTIVO");
  const navigate = useNavigate();

  // ======================
  // cargar personas
  // ======================
  useEffect(() => {
    lookupPersonas().then(res => setPersonas(res.data));
  }, []);

  // ======================
  // cargar deudas
  // ======================
  const cargar = async () => {
    setCargando(true);

    try {
      const res = await resumenDeudas(personaId, estado);

      setMeDeben(res.data?.me_deben || []);
      setYoDebo(res.data?.yo_debo || []);

    } catch {
      setMeDeben([]);
      setYoDebo([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [personaId, estado]);

  // ======================
  // crear prestamo
  // ======================
  const guardar = async (data) => {
    await crearPrestamo(data);
    setMostrarForm(false);
    cargar();
  };

  const estiloCard = (estado) => {

    if (estado === "PAGADO") {
      return {
        background: "#f6f3f3",
        border: "1px solid #d1d5db",
        opacity: 0.8
      };
    }

    if (estado === "ANULADO") {
      return {
        background: "#fee2e2",
        border: "1px solid #fca5a5"
      };
    }

    return {
      background: "#fefefe",
      border: "1px solid #de1414"
    };
  };
  // ======================
  // render
  // ======================
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

      {/* FILTRO PERSONA */}
      <div style={{ marginBottom: 20 }}>

        <select
          value={personaId ?? ""}
          onChange={(e) =>
            setPersonaId(e.target.value ? Number(e.target.value) : null)
          }
          style={{
            minWidth: 220,
            height: 36,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #2b2d33",
            background: "#111217",
            color: "#ffffff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <option value="">Todas las personas</option>

          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        {/* FILTRO ESTADO */}
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          style={{
            minWidth: 180,
            height: 36,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #2b2d33",
            background: "#111217",
            color: "#ffffff",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: 10
          }}
        >
          <option value="ACTIVO">Activos</option>
          <option value="PAGADO">Pagados</option>
          <option value="ANULADO">Anulados</option>
          <option value="">Todos</option>
        </select>
      </div>

      {/* LISTAS */}
      {cargando ? (
        <p>Cargando...</p>
      ) : (

        <>
          {/* ME DEBEN */}
          <h3 style={{ marginBottom: 10 }}>💰 Me deben</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
              marginBottom: 30
            }}
          >

            {meDeben.map((d, i) => (

              <div
                key={d.persona_id || i}
                onClick={() => navigate(`/deudas/${d.deudor_id}/${d.acreedor_id}`)}
 
                style={{
                  borderRadius: 10,
                  padding: 18,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  ...estiloCard(d.estado)
                }}
              >

                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {d.nombre}
                </div>

                <div style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
                  te debe
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#16a34a"
                  }}
                >
                  Bs {Number(d.saldo).toLocaleString()}
                </div>

              </div>

            ))}

          </div>

          {/* YO DEBO */}
          <h3 style={{ marginBottom: 10 }}>💸 Yo debo</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
            }}
          >

            {yoDebo.map((d, i) => (

              <div
                key={d.persona_id || i}
                onClick={() => navigate(`/deudas/${d.deudor_id}/${d.acreedor_id}`)}
                style={{
                  borderRadius: 10,
                  padding: 18,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  ...estiloCard(d.estado)
                }}
              >

                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {d.nombre}
                </div>

                <div style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
                  le debes
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

        </>
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