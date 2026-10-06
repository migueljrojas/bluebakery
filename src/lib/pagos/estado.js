import "server-only";
import { db } from "@/lib/firebase/admin";
import { isAdmin } from "@/lib/auth";

export function resumenPago(pago) {
  return {
    metodo: pago.metodo,
    montoUsd: pago.montoUsd ?? null,
    montoBs: pago.montoBs ?? null,
    referencia: pago.referencia ?? null,
    bancoOrigen: pago.bancoOrigen ?? null,
    fecha: pago.fecha ?? null,
    capturaId: pago.capturaId ?? null,
  };
}

export async function getEstadoPago(email) {
  const snap = await db().collection("pagos").where("email", "==", email).get();
  const pagos = snap.docs
    .map((doc) => doc.data())
    .sort((a, b) => (b.creadoEn?.toMillis?.() ?? 0) - (a.creadoEn?.toMillis?.() ?? 0));

  const pendiente = pagos.find((p) => p.estado === "pendiente");
  if (pendiente) return { pendiente: resumenPago(pendiente), rechazo: null };

  const ultimo = pagos[0];
  return {
    pendiente: null,
    rechazo: ultimo?.estado === "rechazado" ? { motivo: ultimo.motivo ?? null } : null,
  };
}

export async function getPendientesAdmin(email) {
  if (!isAdmin(email)) return null;
  const snap = await db().collection("pagos").where("estado", "==", "pendiente").count().get();
  return snap.data().count;
}
