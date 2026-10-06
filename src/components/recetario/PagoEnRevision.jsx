"use client";
import { useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { BANCOS_VE, formatoBs } from "@/lib/bancos";
import { whatsappUrl } from "@/lib/contacto";

const INTERVALO_MS = 30_000;

function mensajeWhatsApp(pago, email) {
  const lineas = ["Hola Blue Bakery, acabo de pagar el Recetario.", `Correo: ${email}`];
  if (pago?.metodo === "pagomovil") {
    const banco = BANCOS_VE.find((b) => b.codigo === pago.bancoOrigen);
    lineas.push(
      "Método: Pago Móvil",
      `Monto: Bs. ${formatoBs(pago.montoBs)}`,
      `Referencia: ${pago.referencia}`,
      `Banco: ${banco ? `${banco.codigo} - ${banco.nombre}` : pago.bancoOrigen}`,
      `Fecha: ${pago.fecha}`,
      "",
      "Adjunto el comprobante."
    );
  } else if (pago?.metodo === "paypal") {
    lineas.push("Método: PayPal", `Monto: ${pago.montoUsd} USD`, `ID de captura: ${pago.capturaId}`);
  }
  return lineas.join("\n");
}

export default function PagoEnRevision({ pago, email, next, onRechazo }) {
  useEffect(() => {
    let activo = true;

    const consultar = async () => {
      try {
        const res = await fetch("/api/pagos/estado", { cache: "no-store" });
        if (!res.ok || !activo) return;
        const data = await res.json();
        if (data.acceso) window.location.assign(next);
        else if (!data.pendiente) onRechazo(data.rechazo);
      } catch {}
    };

    const intervalo = setInterval(consultar, INTERVALO_MS);
    const alVolver = () => document.visibilityState === "visible" && consultar();
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      activo = false;
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [next, onRechazo]);

  return (
    <div className="text-center space-y-4 py-4">
      <ClockIcon className="h-14 w-14 mx-auto text-cyan-500" />
      <h3 className="text-xl font-bold text-cyan-700">Tu pago está en revisión</h3>
      <p className="text-blue-900">
        Recibimos tu pago y lo estamos verificando. Envíanos el comprobante por
        WhatsApp para agilizar la aprobación.
      </p>
      <a
        href={whatsappUrl(mensajeWhatsApp(pago, email))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3 rounded-full transition"
      >
        Enviar comprobante por WhatsApp
      </a>
      <p className="text-sm text-gray-500">
        Puedes dejar esta página abierta: entrarás al recetario automáticamente
        apenas se apruebe tu pago. También puedes volver más tarde con este mismo
        correo.
      </p>
    </div>
  );
}
