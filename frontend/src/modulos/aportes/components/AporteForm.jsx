import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import Select from "../../../shared/components/form/Select";
import FormLayout from "../../../shared/components/form/FormLayout";
import { listarPeriodos } from "../../../api/periodo";

export default function AporteForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(""); // siempre string para el input
  const [nota, setNota] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    let mounted = true;

    listarPeriodos(1, 200)
      .then((r) => {
        // defensivo: soporta {items: []} o [] directo
        const data = r?.data?.items ?? r?.data ?? [];
        if (mounted) setPeriodos(data);
      })
      .catch(() => {
        if (mounted) setPeriodos([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialData) {
      // reset cuando es "crear"
      setFecha("");
      setMonto("");
      setNota("");
      setPeriodoId("");
      return;
    }

    // ✅ CLAVE: monto viene como Decimal -> string ("500.00")
    // lo dejamos como string para el input type="number"
    setFecha(initialData.fecha ?? "");
    setMonto(initialData.monto != null ? String(initialData.monto) : "");
    setNota(initialData.nota ?? "");
    setPeriodoId(initialData.periodo_id != null ? String(initialData.periodo_id) : "");
  }, [initialData]);

  const submit = () => {
    if (soloLectura) return;

    if (!fecha || !monto) {
      alert("Fecha y monto son obligatorios");
      return;
    }

    const montoNum = Number(monto);
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("Monto inválido");
      return;
    }

    onSubmit({
      fecha,
      monto: montoNum,
      nota: nota?.trim() ? nota.trim() : null,
      periodo_id: periodoId ? Number(periodoId) : null,
    });
  };

  return (
    <FormCard>
      <FormLayout>
        <FormField label="Fecha *">
          <Input
            type="date"
            value={fecha}
            disabled={soloLectura}
            onChange={(e) => setFecha(e.target.value)}
          />
        </FormField>

        <FormField label="Monto *">
          <Input
            type="number"
            step="0.01"
            value={monto}
            disabled={soloLectura}
            onChange={(e) => setMonto(e.target.value)}
          />
        </FormField>

        <FormField label="Período">
          <Select
            value={periodoId}
            onChange={(e) => setPeriodoId(e.target.value)}
            disabled={soloLectura}
          >
            <option value="">Sin período</option>
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Nota">
          <Input
            value={nota}
            disabled={soloLectura}
            onChange={(e) => setNota(e.target.value)}
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