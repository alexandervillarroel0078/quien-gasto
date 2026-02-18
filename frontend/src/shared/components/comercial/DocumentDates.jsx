// export default function DocumentDates({
//   dateLabel = "Fecha",
//   dateValue,
//   extraLabel,
//   extraValue,
// }) {
//   return (
//     <div style={ui.wrap}>
//       <div>
//         <div style={ui.label}>{dateLabel}</div>
//         <input
//           type="date"
//           value={dateValue || ""}
//           disabled
//           style={ui.input}
//         />
//       </div>

//       {extraLabel && (
//         <div>
//           <div style={ui.label}>{extraLabel}</div>
//           <input
//             type="date"
//             value={extraValue || ""}
//             disabled
//             style={ui.input}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
export default function DocumentDates({
  dateLabel = "Fecha",
  dateValue,
  extraLabel,
  extraValue,
}) {
  const toInputDateTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 16);
  };

  return (
    <div style={ui.wrap}>
      <div>
        <div style={ui.label}>{dateLabel}</div>
        <input
          type="datetime-local"
          value={toInputDateTime(dateValue)}
          disabled
          style={ui.input}
        />
      </div>

      {extraLabel && (
        <div>
          <div style={ui.label}>{extraLabel}</div>
          <input
            type="datetime-local"
            value={toInputDateTime(extraValue)}
            disabled
            style={ui.input}
          />
        </div>
      )}
    </div>
  );
}

const ui = {
  wrap: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },
  input: {
    padding: "4px 6px",
    fontSize: 12,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
};
