// // shared\components\comercial\DespachoSelect.jsx
// export default function DespachoSelect({
//   origen,
//   destino,
//   onOrigenChange,
//   onDestinoChange,
//   soloLectura = false,
//   ui,
// }) {
//   return (
//     <>
//       {/* ORIGEN DESPACHO */}
//       <div style={ui.fieldEntrega}>
//         <span style={ui.label}>Origen del despacho</span>
//         <select
//           disabled={soloLectura}
//           value={origen}
//           onChange={(e) => onOrigenChange(e.target.value)}
//           style={soloLectura ? ui.selectDisabled : ui.select}
//         >
//           <option value="">Seleccionar</option>
//           <option value="TIENDA">Desde tienda</option>
//           <option value="CAMION">Desde camión</option>
//           <option value="OTRO">Desde otro origen</option>
//         </select>
//       </div>

//       {/* DESTINO ENTREGA */}
//       <div style={ui.fieldEntrega}>
//         <span style={ui.label}>Destino de entrega</span>
//         <select
//           disabled={soloLectura || !origen}
//           value={destino}
//           onChange={(e) => onDestinoChange(e.target.value)}
//           style={soloLectura ? ui.selectDisabled : ui.select}
//         >
//           <option value="">Seleccionar</option>

//           {origen === "TIENDA" && (
//             <>
//               <option value="RETIRO_TIENDA">Retiro en tienda</option>
//               <option value="DOMICILIO">Domicilio</option>
//               <option value="OBRA">Obra</option>
//               <option value="FERRETERIA">Ferretería</option>
//               <option value="OTRO">Otro</option>
//             </>
//           )}

//           {origen === "CAMION" && (
//             <>
//               <option value="OBRA">Obra</option>
//               <option value="FERRETERIA">Ferretería</option>
//             </>
//           )}
//         </select>
//       </div>
//     </>
//   );
// }
export default function DespachoSelect({
  origen,
  destino,
  onOrigenChange,
  onDestinoChange,
  soloLectura = false,
}) {
  return (
    <div style={ui.wrap}>
      {/* ORIGEN */}
      <div style={ui.field}>
        <span style={ui.label}>Origen del despacho</span>
        <select
          disabled={soloLectura}
          value={origen || ""}
          onChange={(e) => {
            onOrigenChange(e.target.value);
            onDestinoChange(""); // reset destino automáticamente
          }}
          style={soloLectura ? ui.selectDisabled : ui.select}
        >
          <option value="">Seleccionar</option>
          <option value="TIENDA">Desde tienda</option>
          <option value="CAMION">Desde camión</option>
          <option value="OTRO">Desde otro origen</option>
        </select>
      </div>

      {/* DESTINO */}
      <div style={ui.field}>
        <span style={ui.label}>Destino de entrega</span>
        <select
          disabled={soloLectura || !origen}
          value={destino || ""}
          onChange={(e) => onDestinoChange(e.target.value)}
          style={soloLectura ? ui.selectDisabled : ui.select}
        >
          <option value="">Seleccionar</option>

          {origen === "TIENDA" && (
            <>
              <option value="RETIRO_TIENDA">Retiro en tienda</option>
              <option value="DOMICILIO">Domicilio</option>
              <option value="OBRA">Obra</option>
              <option value="FERRETERIA">Ferretería</option>
              <option value="OTRO">Otro</option>
            </>
          )}

          {origen === "CAMION" && (
            <>
              <option value="OBRA">Obra</option>
              <option value="FERRETERIA">Ferretería</option>
            </>
          )}
        </select>
      </div>
    </div>
  );
}
const ui = {
  wrap: {
    display: "flex",
    gap: 8,
  },

  field: {
    width: 160,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  label: {
    fontSize: 11,
    opacity: 0.6,
  },

  select: {
    width: "100%",
    height: 38,
    padding: "0 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    background: "#fff",
  },

  selectDisabled: {
    width: "100%",
    height: 38,
    padding: "0 8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    background: "#f9fafb",
  },
};
