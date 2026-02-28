//src\modulos\banco\components\MovimientoForm.jsx
import { useEffect, useState } from "react";

import Button from "../../../shared/components/Button";
import FormCard from "../../../shared/components/form/FormCard";
import FormField from "../../../shared/components/form/FormField";
import Input from "../../../shared/components/form/Input";
import FormLayout from "../../../shared/components/form/FormLayout";
import Select from "../../../shared/components/form/Select";

import { listarCuentas } from "../../../api/banco/cuenta";
import { listarCategoriasMovimiento } from "../../../api/banco/categoria_movimiento";

export default function MovimientoForm({
  initialData = null,
  onSubmit,
  textoBoton,
  soloLectura = false,
}) {
  const [cuentaId, setCuentaId] = useState("");
  const [tipo, setTipo] = useState("EGRESO");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [fecha, setFecha] = useState("");

  const [cuentas, setCuentas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");

  // ======================
  // Cargar selects
  // ======================
  useEffect(() => {
    const cargar = async () => {
      const resCuentas = await listarCuentas(1, 100);
      setCuentas(resCuentas.data.items);

      const resCategorias = await listarCategoriasMovimiento(1, 100);
      setCategorias(resCategorias.data.items);
    };
    cargar();
  }, []);

  // ======================
  // Precargar
  // ======================
  useEffect(() => {
    if (!initialData) return;

    setCuentaId(initialData.cuenta_id || "");
    setTipo(initialData.tipo || "EGRESO");
    setMonto(initialData.monto || "");
    setConcepto(initialData.concepto || "");
    setFecha(initialData.fecha || "");
    setCategoriaId(initialData.categoria_id || "");
  }, [initialData]);

  // ======================
  // Submit
  // ======================
  const submit = () => {
    if (!cuentaId) return alert("Seleccione una cuenta");
    if (!monto || Number(monto) <= 0)
      return alert("Monto inválido");
    if (!fecha) return alert("Fecha obligatoria");

    onSubmit({
      cuenta_id: Number(cuentaId),
      tipo,
      monto: Number(monto),
      concepto,
      fecha,
      categoria_id: categoriaId ? Number(categoriaId) : null,
    });
  };

  // ======================
  // Render
  // ======================
  return (
    <FormCard>
      <FormLayout>

       <FormField label="Cuenta *">
  <Select
    value={cuentaId}
    disabled={soloLectura}
    onChange={(e) => setCuentaId(e.target.value)}
  >
    <option value="">Seleccione...</option>
    {cuentas.map((c) => (
      <option key={c.id} value={c.id}>
        {c.nombre}
      </option>
    ))}
  </Select>
</FormField>

<FormField label="Tipo (INGRESO / EGRESO) *">
  <Select
    value={tipo}
    disabled={soloLectura}
    onChange={(e) => setTipo(e.target.value)}
  >
    <option value="INGRESO">INGRESO</option>
    <option value="EGRESO">EGRESO</option>
  </Select>
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

<FormField label="Concepto">
  <Input
    value={concepto}
    disabled={soloLectura}
    onChange={(e) => setConcepto(e.target.value)}
  />
</FormField>

<FormField label="Fecha *">
  <Input
    type="date"
    value={fecha}
    disabled={soloLectura}
    onChange={(e) => setFecha(e.target.value)}
  />
</FormField>

<FormField label="Categoría">
  <Select
    value={categoriaId}
    disabled={soloLectura}
    onChange={(e) => setCategoriaId(e.target.value)}
  >
    <option value="">Sin categoría</option>
    {categorias
      .filter((cat) => cat.tipo === tipo)
      .map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.nombre}
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