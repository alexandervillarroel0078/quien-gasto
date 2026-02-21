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
  const [monto, setMonto] = useState(""); // 👈 siempre string
  const [periodoId, setPeriodoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [periodos, setPeriodos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // ======================
  // Cargar catálogos
  // ======================
  useEffect(() => {
    let mounted = true;

    listarPeriodos(1, 200)
      .then((r) => {
        const data = r?.data?.items ?? r?.data ?? [];
        if (mounted) setPeriodos(data);
      })
      .catch(() => mounted && setPeriodos([]));

    listarCategoriasGasto(1, 200, true)
      .then((r) => {
        const data = r?.data?.items ?? r?.data ?? [];
        if (mounted) setCategorias(data);
      })
      .catch(() => mounted && setCategorias([]));

    return () => {
      mounted = false;
    };
  }, []);

  // ======================
  // Cargar edición / ver
  // ======================
  useEffect(() => {
    if (!initialData) {
      // reset al crear
      setFecha("");
      setConcepto("");
      setMonto("");
      setPeriodoId("");
      setCategoriaId("");
      return;
    }

    setFecha(initialData.fecha ?? "");
    setConcepto(initialData.concepto ?? "");
    setMonto(initialData.monto != null ? String(initialData.monto) : ""); // 👈 CLAVE
    setPeriodoId(
      initialData.periodo_id != null ? String(initialData.periodo_id) : ""
    );
    setCategoriaId(
      initialData.categoria_id != null ? String(initialData.categoria_id) : ""
    );
  }, [initialData]);

  const submit = () => {
    if (soloLectura) return;

    if (!fecha || !concepto || !monto) {
      alert("Complete todos los campos obligatorios");
      return;
    }

    const montoNum = Number(monto);
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("Monto inválido");
      return;
    }

    onSubmit({
      fecha,
      concepto: concepto.trim(),
      monto: montoNum,
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
            onChange={(e) => setFecha(e.target.value)}
          />
        </FormField>

        <FormField label="Concepto *">
          <Input
            value={concepto}
            disabled={soloLectura}
            onChange={(e) => setConcepto(e.target.value)}
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