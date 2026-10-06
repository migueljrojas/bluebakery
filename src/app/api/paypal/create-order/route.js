import { NextResponse } from "next/server";
import { getSessionUser, hasAccess } from "@/lib/auth";
import { crearOrden } from "@/lib/pagos/paypal";
import { getPrecioUsd } from "@/lib/tasa";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  }
  if (await hasAccess(user.email)) {
    return NextResponse.json({ error: "Ya tienes acceso" }, { status: 409 });
  }

  try {
    const id = await crearOrden({ uid: user.uid, montoUsd: getPrecioUsd() });
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error creando la orden de PayPal", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago" },
      { status: 502 }
    );
  }
}
