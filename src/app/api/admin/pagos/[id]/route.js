import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSessionUser, isAdmin, otorgarAcceso } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";

const TRANSICIONES = {
  aprobar: { desde: ["pendiente", "rechazado"], hacia: "aprobado" },
  rechazar: { desde: ["pendiente"], hacia: "rechazado" },
};

export async function POST(request, { params }) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { accion, motivo } = await request.json().catch(() => ({}));
  const transicion = TRANSICIONES[accion];
  if (!transicion) {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  const ref = db().collection("pagos").doc(id);
  const resultado = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { error: "El pago no existe", status: 404 };
    const pago = snap.data();
    if (!transicion.desde.includes(pago.estado)) {
      return { error: `El pago ya está ${pago.estado}`, status: 409 };
    }
    tx.update(ref, {
      estado: transicion.hacia,
      motivo: accion === "rechazar" ? String(motivo ?? "").slice(0, 300) || null : null,
      revisadoPor: user.email,
      revisadoEn: FieldValue.serverTimestamp(),
    });
    return { pago };
  });

  if (resultado.error) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }

  if (accion === "aprobar") {
    const { pago } = resultado;
    await otorgarAcceso({ uid: pago.uid, email: pago.email, metodo: pago.metodo, pagoId: id });
  }
  return NextResponse.json({ ok: true });
}
