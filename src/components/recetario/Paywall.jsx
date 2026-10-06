"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PagoMovilForm from "./PagoMovilForm";
import PayPalCheckout from "./PayPalCheckout";
import PagoEnRevision from "./PagoEnRevision";

const TABS = [
  { id: "venezuela", label: "Venezuela", detalle: "Pago Móvil" },
  { id: "mundo", label: "Resto del Mundo", detalle: "PayPal" },
];

const BENEFICIOS = [
  "Acceso de por vida, sin suscripciones",
  "Recetas paso a paso con ingredientes y materiales",
  "Disponible en tu teléfono, tablet o computadora",
];

export default function Paywall({
  next,
  email,
  precioUsd,
  cotizacion,
  pagoPendiente,
  rechazo: rechazoInicial,
  paypalClientId,
  beneficiario,
}) {
  const [tab, setTab] = useState("venezuela");
  const [pendiente, setPendiente] = useState(pagoPendiente);
  const [rechazo, setRechazo] = useState(rechazoInicial);

  useEffect(() => {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zona !== "America/Caracas") setTab("mundo");
  }, []);

  const onPendiente = useCallback((pago) => {
    setRechazo(null);
    setPendiente(pago);
  }, []);

  const onRechazo = useCallback((info) => {
    setPendiente(null);
    setRechazo(info ?? { motivo: null });
  }, []);

  if (pendiente) {
    return (
      <div className="rounded-2xl bg-white shadow-xl p-6">
        <PagoEnRevision pago={pendiente} email={email} next={next} onRechazo={onRechazo} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
      {rechazo && (
        <div className="m-6 mb-0 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p className="font-semibold">No pudimos confirmar tu último pago.</p>
          {rechazo.motivo && <p className="mt-1">Motivo: {rechazo.motivo}</p>}
          <p className="mt-1">
            Puedes registrarlo de nuevo o escribirnos por WhatsApp.
          </p>
        </div>
      )}
      <ul className="px-6 pt-6 space-y-2">
        {BENEFICIOS.map((b) => (
          <li key={b} className="flex items-center gap-2 text-cyan-900">
            <CheckCircleIcon className="h-5 w-5 text-cyan-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <div role="tablist" className="mt-6 grid grid-cols-2 border-y border-sky-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`py-4 px-2 text-center transition border-b-2 ${
              tab === t.id
                ? "border-cyan-500 bg-sky-50 text-cyan-700"
                : "border-transparent text-gray-500 hover:text-cyan-600"
            }`}
          >
            <span className="block font-semibold">{t.label}</span>
            <span className="block text-xs font-abeeze">{t.detalle}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-6">
        {tab === "venezuela" ? (
          <PagoMovilForm
            next={next}
            cotizacion={cotizacion}
            beneficiario={beneficiario}
            onPendiente={onPendiente}
          />
        ) : (
          <PayPalCheckout
            precioUsd={precioUsd}
            clientId={paypalClientId}
            onPendiente={onPendiente}
          />
        )}
      </div>
    </div>
  );
}
