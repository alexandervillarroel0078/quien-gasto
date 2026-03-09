//src/modulos/prestamo/components/PrestamoForm.jsx
import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

import { lookupPersonas } from "../../../api/persona";
import Select from "../../../shared/components/form/Select";
import useAuth from "../../../auth/useAuth";

export default function PrestamoForm({
  initialData = null,
  onSubmit,
  textoBoton = "Guardar",
  soloLectura = false,
  prestamistaNombre = "",
}) {

  const [deudor_id, setDeudor] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [concepto, setConcepto] = useState("");

  const [personas, setPersonas] = useState([]);
  const { user } = useAuth();
  // ======================
  // Cargar personas
  // ======================
  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      const res = await lookupPersonas();
      setPersonas(res.data || []);
    } catch {
      setPersonas([]);
    }
  };

  // ======================
  // Precargar datos (editar)
  // ======================
  useEffect(() => {

    if (!initialData) return;

    setDeudor(initialData.deudor?.id || "");
    setMonto(initialData.monto || "");
    setFecha(initialData.fecha || "");
    setConcepto(initialData.concepto || "");

  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {

    if (!deudor_id) {
      return alert("Debe seleccionar la persona");
    }

    if (!monto) {
      return alert("El monto es obligatorio");
    }

    if (!fecha) {
      return alert("La fecha es obligatoria");
    }

    onSubmit({
      prestamista_id: user?.persona_id,
      deudor_id,
      monto,
      fecha,
      concepto,
    });

  };

  // ======================
  // Render
  // ======================
  return (
    <FormCard>

      <FormLayout>
        {/* PRESTAMISTA */}
        <FormField label="Prestamista">
          <Input
            value={user?.correo?.split("@")[0] || "Yo"}
            disabled
          />
        </FormField>

        {/* DEUDOR */}
        <FormField label="Persona que recibe el préstamo *">
          <Select
            value={deudor_id}
            disabled={soloLectura}
            onChange={(e) => setDeudor(e.target.value)}
          >
            <option value="">Seleccionar</option>

            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}

          </Select>
        </FormField>


        {/* MONTO */}
        <FormField label="Monto *">
          <Input
            type="number"
            value={monto}
            disabled={soloLectura}
            onChange={(e) => setMonto(e.target.value)}
          />
        </FormField>


        {/* FECHA */}
        <FormField label="Fecha *">
          <Input
            type="date"
            value={fecha}
            disabled={soloLectura}
            onChange={(e) => setFecha(e.target.value)}
          />
        </FormField>


        {/* CONCEPTO */}
        <FormField label="Concepto">
          <Input
            value={concepto}
            disabled={soloLectura}
            onChange={(e) => setConcepto(e.target.value)}
          />
        </FormField>


        {!soloLectura && (
          <Button variant="primary" onClick={submit}>
            {textoBoton}
          </Button>
        )}

      </FormLayout>

    </FormCard>
  );
}
