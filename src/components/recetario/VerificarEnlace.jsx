"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth, crearSesion, EMAIL_STORAGE_KEY } from "@/lib/firebase/client";

export default function VerificarEnlace({ next }) {
  const [estado, setEstado] = useState("verificando");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const iniciado = useRef(false);

  const completar = useCallback(
    async (correo) => {
      setEstado("verificando");
      setErrorEmail("");
      const auth = getFirebaseAuth();
      try {
        const { user } = await signInWithEmailLink(
          auth,
          correo,
          window.location.href
        );
        window.localStorage.removeItem(EMAIL_STORAGE_KEY);
        await crearSesion(user);
        await signOut(auth);
        window.location.assign(next);
      } catch (err) {
        console.error(err);
        if (err?.code === "auth/invalid-email") {
          window.localStorage.removeItem(EMAIL_STORAGE_KEY);
          setErrorEmail("Ese correo no coincide con el que solicitó el enlace.");
          setEstado("pedirEmail");
        } else if (err?.code?.startsWith("auth/")) {
          setEstado("error");
        } else {
          await signOut(auth).catch(() => {});
          setEstado("errorSesion");
        }
      }
    },
    [next]
  );

  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;

    if (!isSignInWithEmailLink(getFirebaseAuth(), window.location.href)) {
      setEstado("invalido");
      return;
    }
    const guardado = window.localStorage.getItem(EMAIL_STORAGE_KEY);
    if (guardado) completar(guardado);
    else setEstado("pedirEmail");
  }, [completar]);

  if (estado === "verificando") {
    return <p className="text-center text-blue-900">Verificando tu acceso...</p>;
  }

  if (estado === "pedirEmail") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          completar(email.trim());
        }}
        className="space-y-3"
      >
        <p className="text-sm text-blue-900">
          Por seguridad, confirma el correo al que te enviamos el enlace.
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full rounded-lg border border-sky-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Confirmar
        </button>
        {errorEmail && <p className="text-sm text-rose-600 text-center">{errorEmail}</p>}
      </form>
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-rose-600">
        {estado === "invalido" && "Este enlace no es válido."}
        {estado === "error" && "El enlace expiró o ya fue usado."}
        {estado === "errorSesion" &&
          "Verificamos tu correo, pero no pudimos iniciar la sesión. Intenta de nuevo en unos minutos."}
      </p>
      <Link
        href="/recetario/acceso"
        className="inline-block bg-cyan-500 text-white px-4 py-2 rounded"
      >
        Solicitar un nuevo enlace
      </Link>
    </div>
  );
}
