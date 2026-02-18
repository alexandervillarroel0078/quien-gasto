import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

export default function PersonaForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [nombre, setNombre] = useState("");

  // ======================
  // Precargar
  // ======================
  useEffect(() => {
    if (!initialData) return;
    setNombre(initialData.nombre || "");
  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {
    if (!nombre.trim()) {
      return alert("El nombre es obligatorio");
    }

    onSubmit({ nombre });
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
            disabled={soloLectura}
            onChange={e => setNombre(e.target.value)}
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
