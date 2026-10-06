"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatoBs } from "@/lib/bancos";

function Dato({ etiqueta, valor }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="text-xs text-gray-500">{etiqueta}</dt>
      <dd className="font-semibold text-cyan-900 break-all">{valor}</dd>
    </div>
  );
}

function PagoCard({ pago, estado }) {
  const router = useRouter();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const revisar = async (accion) => {
    let motivo;
    if (accion === "rechazar") {
      motivo = window.prompt("Motivo del rechazo (el cliente lo verá en la página de pago):", "");
      if (motivo === null) return;
    } else if (!window.confirm(`¿Aprobar el pago de ${pago.email}?`)) {
      return;
    }

    setProcesando(true);
    setError("");
    const res = await fetch(`/api/admin/pagos/${encodeURIComponent(pago.id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, motivo }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo actualizar el pago");
    }
    setProcesando(false);
  };

  const esPagoMovil = pago.metodo === "pagomovil";

  return (
    <li className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
              esPagoMovil ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {esPagoMovil ? "Pago Móvil" : "PayPal"}
          </span>
          <p className="mt-2 font-semibold text-cyan-900 break-all">{pago.email}</p>
          <p className="text-xs text-gray-500">Registrado: {pago.creadoEn}</p>
        </div>
        <p className="text-2xl font-bold text-cyan-600 font-merienda">
          {esPagoMovil ? `Bs. ${formatoBs(pago.montoBs)}` : `${pago.montoUsd} USD`}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 text-sm">
        <Dato etiqueta="Referencia" valor={pago.referencia} />
        <Dato etiqueta="Banco origen" valor={pago.banco} />
        <Dato etiqueta="Teléfono" valor={pago.telefono} />
        <Dato etiqueta="Fecha del pago" valor={pago.fechaPago} />
        <Dato etiqueta="Cuenta PayPal" valor={pago.pagador} />
        <Dato etiqueta="ID de captura PayPal" valor={pago.capturaId} />
        <Dato etiqueta="Motivo" valor={pago.motivo} />
        <Dato etiqueta="Revisado por" valor={pago.revisadoPor} />
      </dl>

      {estado !== "aprobado" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => revisar("aprobar")}
            disabled={procesando}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
          >
            Aprobar
          </button>
          {estado === "pendiente" && (
            <button
              onClick={() => revisar("rechazar")}
              disabled={procesando}
              className="border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
            >
              Rechazar
            </button>
          )}
        </div>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </li>
  );
}

export default function PagosAdmin({ pagos, estado }) {
  if (pagos.length === 0) {
    return (
      <p className="mt-10 text-center text-gray-500">No hay pagos en esta lista.</p>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {pagos.map((pago) => (
        <PagoCard key={pago.id} pago={pago} estado={estado} />
      ))}
    </ul>
  );
}
