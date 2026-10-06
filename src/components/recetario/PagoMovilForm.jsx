"use client";
import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { BANCOS_VE, formatoBs } from "@/lib/bancos";

const hoyCaracas = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Caracas" }).format(new Date());

function DatoCopiable({ etiqueta, valor }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(valor);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-sky-100 last:border-0">
      <div>
        <p className="text-xs text-gray-500">{etiqueta}</p>
        <p className="font-semibold text-cyan-900">{valor}</p>
      </div>
      <button
        type="button"
        onClick={copiar}
        className="text-cyan-600 hover:text-sky-500"
        aria-label={`Copiar ${etiqueta}`}
      >
        {copiado ? <CheckIcon className="h-5 w-5" /> : <ClipboardDocumentIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}

export default function PagoMovilForm({ next, cotizacion, beneficiario, onPendiente }) {
  const [form, setForm] = useState({
    bancoOrigen: "",
    telefono: "",
    referencia: "",
    fecha: hoyCaracas(),
  });
  const [estado, setEstado] = useState("idle");
  const [error, setError] = useState("");

  if (!cotizacion) {
    return (
      <p className="text-center text-gray-500">
        No pudimos obtener la tasa del día. Recarga la página en unos minutos.
      </p>
    );
  }

  const montoTexto = formatoBs(cotizacion.montoBs);

  const actualizar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEstado("enviando");
    try {
      const res = await fetch("/api/pago-movil/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (data.estado === "aprobado") {
        window.location.assign(next);
        return;
      }
      if (data.estado === "pendiente") {
        onPendiente(data.pago);
        return;
      }
      setError(data.error ?? "No pudimos registrar el pago.");
    } catch {
      setError("No pudimos registrar el pago. Revisa tu conexión.");
    }
    setEstado("idle");
  };

  const inputClass =
    "w-full rounded-lg border border-sky-200 bg-white px-3 py-2.5 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">Total a pagar</p>
        <p className="text-4xl font-bold text-cyan-600 font-merienda">Bs. {montoTexto}</p>
      </div>

      <div className="rounded-xl bg-sky-50 px-4 py-2">
        <p className="pt-2 pb-1 text-sm font-semibold text-cyan-800">
          1. Haz un Pago Móvil a estos datos
        </p>
        <DatoCopiable
          etiqueta="Banco"
          valor={`${beneficiario.bancoCodigo} - ${beneficiario.bancoNombre}`}
        />
        <DatoCopiable etiqueta="Teléfono" valor={beneficiario.telefono} />
        <DatoCopiable etiqueta="Cédula / RIF" valor={beneficiario.documento} />
        <DatoCopiable etiqueta="Monto (Bs.)" valor={montoTexto} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm font-semibold text-cyan-800">
          2. Registra los datos de tu pago para que lo verifiquemos
        </p>
        <div>
          <label htmlFor="bancoOrigen" className="block text-sm text-gray-600 mb-1">
            Banco desde el que pagaste
          </label>
          <select
            id="bancoOrigen"
            required
            value={form.bancoOrigen}
            onChange={actualizar("bancoOrigen")}
            className={inputClass}
          >
            <option value="" disabled>
              Selecciona tu banco
            </option>
            {BANCOS_VE.map((b) => (
              <option key={b.codigo} value={b.codigo}>
                {b.codigo} - {b.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="telefono" className="block text-sm text-gray-600 mb-1">
              Teléfono desde el que pagaste
            </label>
            <input
              id="telefono"
              type="tel"
              inputMode="numeric"
              required
              placeholder="04141234567"
              value={form.telefono}
              onChange={actualizar("telefono")}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="fecha" className="block text-sm text-gray-600 mb-1">
              Fecha del pago
            </label>
            <input
              id="fecha"
              type="date"
              required
              max={hoyCaracas()}
              value={form.fecha}
              onChange={actualizar("fecha")}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="referencia" className="block text-sm text-gray-600 mb-1">
            Número de referencia
          </label>
          <input
            id="referencia"
            inputMode="numeric"
            required
            placeholder="Ej: 001234567890"
            value={form.referencia}
            onChange={actualizar("referencia")}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : "Registrar pago"}
        </button>
        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
