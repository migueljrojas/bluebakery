import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/rutas";

const EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_AUTH_AGE_S = 5 * 60;

export async function POST(request) {
  const { idToken } = await request.json().catch(() => ({}));
  if (!idToken) {
    return NextResponse.json({ error: "Falta el token" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    if (Date.now() / 1000 - decoded.auth_time > MAX_AUTH_AGE_S) {
      return NextResponse.json(
        { error: "Inicia sesión nuevamente" },
        { status: 401 }
      );
    }
    if (!decoded.email || decoded.email_verified === false) {
      return NextResponse.json(
        { error: "El correo no está verificado" },
        { status: 401 }
      );
    }

    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      maxAge: EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("Error creando la sesión", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
