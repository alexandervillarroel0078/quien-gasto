// src/modulos/banco/components/CuentaForm.jsx
import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import Select from "../../../shared/components/form/Select"; // 👈 FALTABA ESTO
import FormLayout from "../../../shared/components/form/FormLayout";

const TIPOS_CUENTA = ["BANCO", "CAJA", "AHORRO", "INVERSION"];
const MONEDAS = ["BOB", "USD"];

export default function CuentaForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [nombre, setNombre] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [banco, setBanco] = useState("");
  const [tipo, setTipo] = useState("BANCO");
  const [moneda, setMoneda] = useState("BOB");

  useEffect(() => {
    if (!initialData) return;
    setNombre(initialData.nombre || "");
    setNumeroCuenta(initialData.numero_cuenta || "");
    setBanco(initialData.banco || "");
    setTipo(initialData.tipo || "BANCO");
    setMoneda(initialData.moneda || "BOB");
  }, [initialData]);

  const submit = () => {
    if (!nombre.trim()) return alert("Nombre obligatorio");

    onSubmit({
      nombre,
      numero_cuenta: numeroCuenta || null,
      banco: banco || null,
      tipo,
      moneda,
    });
  };

  return (
    <FormCard>
      <FormLayout>
        <FormField label="Nombre *">
          <Input
            value={nombre}
            disabled={soloLectura}
            onChange={(e) => setNombre(e.target.value)}
          />
        </FormField>

        <FormField label="Número Cuenta">
          <Input
            value={numeroCuenta}
            disabled={soloLectura}
            onChange={(e) => setNumeroCuenta(e.target.value)}
          />
        </FormField>

        <FormField label="Banco">
          <Input
            value={banco}
            disabled={soloLectura}
            onChange={(e) => setBanco(e.target.value)}
          />
        </FormField>

        <FormField label="Tipo *">
          <Select
            value={tipo}
            disabled={soloLectura}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS_CUENTA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Moneda *">
          <Select
            value={moneda}
            disabled={soloLectura}
            onChange={(e) => setMoneda(e.target.value)}
          >
            {MONEDAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
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