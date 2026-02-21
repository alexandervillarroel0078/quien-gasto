import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import Select from "../../../shared/components/form/Select";
import FormLayout from "../../../shared/components/form/FormLayout";
import { listarPeriodos } from "../../../api/periodo";
import { listarCategoriasGasto } from "../../../api/categoriaGasto";

export default function GastoForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [fecha, setFecha] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [periodos, setPeriodos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    listarPeriodos(1, 200).then((r) => setPeriodos(r.data.items || []));
    listarCategoriasGasto(1, 200, true).then((r) => setCategorias(r.data.items || []));
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setFecha(initialData.fecha);
    setConcepto(initialData.concepto || "");
    setMonto(initialData.monto);
    setPeriodoId(initialData.periodo_id ?? "");
    setCategoriaId(initialData.categoria_id ?? "");
  }, [initialData]);

  const submit = () => {
    if (!fecha || !concepto || !monto) {
      return alert("Complete todos los campos obligatorios");
    }
    onSubmit({
      fecha,
      concepto,
      monto: Number(monto),
      periodo_id: periodoId ? Number(periodoId) : null,
      categoria_id: categoriaId ? Number(categoriaId) : null,
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

        <FormField label="Categoría">
          <Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            disabled={soloLectura}
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
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
