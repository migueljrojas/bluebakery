import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSessionUser, hasAccess } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";
import { getMontoBs, getPrecioUsd } from "@/lib/tasa";
import { BANCOS_VE } from "@/lib/bancos";
import { resumenPago } from "@/lib/pagos/estado";

const DIAS_MAXIMOS = 7;

function normalizarTelefono(valor) {
  const digitos = String(valor ?? "").replace(/\D/g, "");
  return digitos.startsWith("58") ? `0${digitos.slice(2)}` : digitos;
}

function validar({ referencia, telefono, bancoOrigen, fecha }) {
  if (!/^\d{4,20}$/.test(referencia)) return "La referencia debe tener solo números.";
  if (!/^04\d{9}$/.test(telefono)) return "El teléfono debe tener el formato 04XX-XXXXXXX.";
  if (!BANCOS_VE.some((b) => b.codigo === bancoOrigen)) return "Selecciona el banco de origen.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return "La fecha no es válida.";

  const diasAtras = (Date.now() - new Date(`${fecha}T12:00:00-04:00`).getTime()) / 864e5;
  if (Number.isNaN(diasAtras) || diasAtras < -1 || diasAtras > DIAS_MAXIMOS) {
    return `La fecha del pago debe ser de los últimos ${DIAS_MAXIMOS} días.`;
  }
  return null;
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión" }, { status: 401 });
  }
  if (await hasAccess(user.email)) {
    return NextResponse.json({ estado: "aprobado" });
  }

  const body = await request.json().catch(() => ({}));
  const datos = {
    referencia: String(body.referencia ?? "").replace(/\D/g, ""),
    telefono: normalizarTelefono(body.telefono),
    bancoOrigen: String(body.bancoOrigen ?? ""),
    fecha: String(body.fecha ?? ""),
  };
  const errorValidacion = validar(datos);
  if (errorValidacion) {
    return NextResponse.json({ error: errorValidacion }, { status: 400 });
  }

  let cotizacion;
  try {
    cotizacion = await getMontoBs();
  } catch (error) {
    console.error("No se pudo obtener la tasa Euro BCV", error);
    return NextResponse.json(
      { error: "No pudimos obtener la tasa del día. Intenta de nuevo." },
      { status: 503 }
    );
  }

  const pagoId = `pagomovil_${datos.bancoOrigen}_${datos.referencia}`;
  const ref = db().collection("pagos").doc(pagoId);
  const pago = {
    uid: user.uid,
    email: user.email,
    metodo: "pagomovil",
    ...datos,
    montoUsd: getPrecioUsd(),
    montoBs: cotizacion.montoBs,
    tasa: cotizacion.tasa,
    fechaTasa: cotizacion.fecha,
    estado: "pendiente",
  };

  const resultado = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists && snap.data().estado !== "rechazado") {
      return snap.data().email === user.email
        ? { estado: snap.data().estado, pago: snap.data() }
        : { conflicto: true };
    }
    tx.set(ref, { ...pago, creadoEn: FieldValue.serverTimestamp() });
    return { estado: "pendiente", pago };
  });

  if (resultado.conflicto) {
    return NextResponse.json(
      { error: "Esta referencia ya fue registrada." },
      { status: 409 }
    );
  }
  return NextResponse.json({
    estado: resultado.estado,
    pago: resumenPago(resultado.pago),
  });
}
