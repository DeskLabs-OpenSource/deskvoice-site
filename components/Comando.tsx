"use client";
import { useState } from "react";

/** Um comando para copiar. O texto está no HTML servido; o botão é só uma camada por cima. */
export function Comando({ children, rotulo }: { children: string; rotulo?: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <figure className="comando">
      {rotulo && <figcaption>{rotulo}</figcaption>}
      <pre><code>{children}</code></pre>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(children).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1600); })}
        aria-live="polite"
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </figure>
  );
}
