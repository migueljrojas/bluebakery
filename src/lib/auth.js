import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, db } from "@/lib/firebase/admin";
import { SESSION_COOKIE, conNext } from "@/lib/rutas";

export const getSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded.email) return null;
    return {
      uid: decoded.uid,
      email: decoded.email.toLowerCase(),
      name: decoded.name ?? null,
    };
  } catch {
    return null;
  }
});

export function isAdmin(email) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export const hasAccess = cache(async (email) => {
  if (!email) return false;
  if (isAdmin(email)) return true;
  const snap = await db().collection("accesos").doc(email.toLowerCase()).get();
  return snap.exists;
});

export async function otorgarAcceso({ uid, email, metodo, pagoId }) {
  const { FieldValue } = await import("firebase-admin/firestore");
  await db()
    .collection("accesos")
    .doc(email.toLowerCase())
    .set(
      {
        uid,
        email: email.toLowerCase(),
        metodo,
        pagoId,
        otorgadoEn: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

export async function requireRecetarioAccess(nextPath) {
  const user = await getSessionUser();
  if (!user) redirect(conNext("/recetario/acceso", nextPath));
  if (!(await hasAccess(user.email))) {
    redirect(conNext("/recetario/pago", nextPath));
  }
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect(conNext("/recetario/acceso", "/admin"));
  if (!isAdmin(user.email)) redirect("/");
  return user;
}
