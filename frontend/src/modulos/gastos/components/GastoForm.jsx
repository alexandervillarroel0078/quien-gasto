import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

export default function GastoForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [fecha, setFecha] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");

  // ======================
  // Precargar
  // ======================
  useEffect(() => {
    if (!initialData) return;

    setFecha(initialData.fecha);
    setConcepto(initialData.concepto || "");
    setMonto(initialData.monto);
  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {
    if (!fecha || !concepto || !monto) {
      return alert("Complete todos los campos obligatorios");
    }

    onSubmit({
      fecha,
      concepto,
      monto: Number(monto),
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

        <FormField label="Concepto *">
          <Input
            value={concepto}
            disabled={soloLectura}
            onChange={e => setConcepto(e.target.value)}
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

        {!soloLectura && (
          <Button variant="primary" onClick={submit}>
            {textoBoton}
          </Button>
        )}
      </FormLayout>
    </FormCard>
  );
}
