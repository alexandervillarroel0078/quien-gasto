//src\modulos\banco\components\CategoriaMovimientoForm.jsx
import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";

export default function CategoriaMovimientoForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("EGRESO");

  useEffect(() => {
    if (!initialData) return;
    setNombre(initialData.nombre || "");
    setTipo(initialData.tipo || "EGRESO");
  }, [initialData]);

  const submit = () => {
    if (!nombre.trim()) return alert("Nombre obligatorio");

    onSubmit({ nombre, tipo });
  };

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

        <FormField label="Tipo (INGRESO / EGRESO)">
          <Input
            value={tipo}
            disabled={soloLectura}
            onChange={e => setTipo(e.target.value)}
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