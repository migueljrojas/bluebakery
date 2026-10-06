import { NextResponse } from "next/server";
import { getSessionUser, hasAccess } from "@/lib/auth";
import { getEstadoPago } from "@/lib/pagos/estado";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  }
  if (await hasAccess(user.email)) {
    return NextResponse.json({ acceso: true });
  }
  const { pendiente, rechazo } = await getEstadoPago(user.email);
  return NextResponse.json({ acceso: false, pendiente: Boolean(pendiente), rechazo });
}
