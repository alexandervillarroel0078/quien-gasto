import { useState, useEffect } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

export default function PeriodoForm({ initialData = null, onSubmit, textoBoton }) {
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setNombre(initialData.nombre || "");
    setFechaInicio(initialData.fecha_inicio || "");
    setFechaFin(initialData.fecha_fin || "");
  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {
    if (!nombre || !fechaInicio || !fechaFin) {
      return alert("Complete todos los campos");
    }

    if (fechaFin < fechaInicio) {
      return alert("La fecha fin no puede ser menor a la fecha inicio");
    }

    onSubmit({
      nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });
  };

  // ======================
  // Render
  // ======================
  return (
    <FormCard>
      <FormLayout>
        <FormField label="Nombre *">
          <Input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Febrero 2026"
          />
        </FormField>

        <FormField label="Fecha inicio *">
          <Input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </FormField>

        <FormField label="Fecha fin *">
          <Input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </FormField>

        <Button variant="primary" onClick={submit}>
          {textoBoton}
        </Button>
      </FormLayout>
    </FormCard>
  );
}
