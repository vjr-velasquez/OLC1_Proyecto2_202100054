// Consola.jsx
function toSafeText(x) {
  if (x === null || x === undefined) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  try { return JSON.stringify(x); } catch { return String(x); }
}

export default function Consola({ texto }) {
  // Acepta string, array o lo que venga y lo vuelve string
  const renderText = Array.isArray(texto)
    ? texto.map(toSafeText).join("")   // une todo si llega como lista de mensajes
    : toSafeText(texto);

  return (
    <div className="seccion">
      <h3>Consola</h3>
      <pre className="consola">{renderText}</pre>
    </div>
  );
}
