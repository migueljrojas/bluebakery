import "server-only";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function leerPrivateKey() {
  return (process.env.FIREBASE_PRIVATE_KEY ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
}

function getAdminApp() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = leerPrivateKey();
  const faltantes = Object.entries({
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey,
  })
    .filter(([, valor]) => !valor)
    .map(([nombre]) => nombre);
  if (faltantes.length) {
    throw new Error(`Faltan variables de Firebase Admin: ${faltantes.join(", ")}`);
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminAuth = () => getAuth(getAdminApp());
export const db = () => getFirestore(getAdminApp());
