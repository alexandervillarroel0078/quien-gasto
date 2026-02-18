import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

export default function AporteForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [nota, setNota] = useState("");

  // ======================
  // Precargar
  // ======================
  useEffect(() => {
    if (!initialData) return;

    setFecha(initialData.fecha);
    setMonto(initialData.monto);
    setNota(initialData.nota || "");
  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {
    if (!fecha || !monto) {
      return alert("Fecha y monto son obligatorios");
    }

    onSubmit({
      fecha,
      monto: Number(monto),
      nota: nota || null,
    });
  };

  // ======================
  // Render
  // ======================
  return (
    <FormCard>
      <FormLayout>
        <FormField label="Fecha *">
          <Input
            type="date"
            value={fecha}
            disabled={soloLectura}
            onChange={e => setFecha(e.target.value)}
          />
        </FormField>

        <FormField label="Monto *">
          <Input
            type="number"
            step="0.01"
            value={monto}
            disabled={soloLectura}
            onChange={e => setMonto(e.target.value)}
          />
        </FormField>

        <FormField label="Nota">
          <Input
            value={nota}
            disabled={soloLectura}
            onChange={e => setNota(e.target.value)}
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
