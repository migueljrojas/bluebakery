import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";
import { capturarOrden, validarCaptura } from "@/lib/pagos/paypal";
import { getPrecioUsd } from "@/lib/tasa";
import { resumenPago } from "@/lib/pagos/estado";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  }

  const { orderId } = await request.json().catch(() => ({}));
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "Falta la orden" }, { status: 400 });
  }

  try {
    const orden = await capturarOrden(orderId);
    const { valido, motivo, captura } = validarCaptura(orden, {
      uid: user.uid,
      montoUsd: getPrecioUsd(),
    });

    const pagoId = `paypal_${captura?.id ?? orderId}`;
    const pago = {
      uid: user.uid,
      email: user.email,
      metodo: "paypal",
      montoUsd: Number(captura?.amount?.value ?? 0),
      ordenId: orderId,
      capturaId: captura?.id ?? null,
      pagador: orden?.payer?.email_address ?? null,
      estado: valido ? "pendiente" : "rechazado",
      motivo: motivo ?? null,
    };

    const ref = db().collection("pagos").doc(pagoId);
    await db().runTransaction(async (tx) => {
      if ((await tx.get(ref)).exists) return;
      tx.set(ref, { ...pago, creadoEn: FieldValue.serverTimestamp() });
    });

    if (!valido) {
      return NextResponse.json({ error: motivo }, { status: 402 });
    }
    return NextResponse.json({ estado: "pendiente", pago: resumenPago(pago) });
  } catch (error) {
    console.error("Error capturando la orden de PayPal", error);
    return NextResponse.json(
      { error: "No se pudo confirmar el pago" },
      { status: 502 }
    );
  }
}
