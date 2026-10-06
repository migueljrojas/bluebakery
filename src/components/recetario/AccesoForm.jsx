"use client";
import { useState } from "react";
import { sendSignInLinkToEmail, signInWithPopup, signOut } from "firebase/auth";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  getFirebaseAuth,
  getGoogleProvider,
  crearSesion,
  EMAIL_STORAGE_KEY,
} from "@/lib/firebase/client";

export default function AccesoForm({ next }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("idle");
  const [error, setError] = useState("");

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setEstado("enviando");
    try {
      const url = new URL("/recetario/acceso/verificar", window.location.origin);
      url.searchParams.set("next", next);
      await sendSignInLinkToEmail(getFirebaseAuth(), email.trim(), {
        url: url.toString(),
        handleCodeInApp: true,
      });
      window.localStorage.setItem(EMAIL_STORAGE_KEY, email.trim());
      setEstado("enviado");
    } catch (err) {
      console.error(err);
      setError("No pudimos enviar el enlace. Verifica tu correo e intenta de nuevo.");
      setEstado("idle");
    }
  };

  const handleGoogle = async () => {
    setError("");
    setEstado("google");
    try {
      const auth = getFirebaseAuth();
      const { user } = await signInWithPopup(auth, getGoogleProvider());
      await crearSesion(user);
      await signOut(auth);
      window.location.assign(next);
    } catch (err) {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("No pudimos iniciar sesión con Google. Intenta de nuevo.");
      }
      setEstado("idle");
    }
  };

  if (estado === "enviado") {
    return (
      <div className="text-center space-y-4">
        <EnvelopeIcon className="h-14 w-14 mx-auto text-cyan-500" />
        <p className="text-blue-900">
          Te enviamos un enlace de acceso a <strong>{email}</strong>. Ábrelo
          desde este mismo dispositivo para entrar al recetario.
        </p>
        <p className="text-sm text-gray-500">
          ¿No lo ves? Revisa la carpeta de spam o promociones.
        </p>
        <button
          onClick={() => setEstado("idle")}
          className="text-sm text-cyan-600 underline"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmail} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold text-cyan-900">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full rounded-lg border border-sky-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
        <button
          type="submit"
          disabled={estado !== "idle"}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : "Enviarme el enlace de acceso"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />o<span className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={estado !== "idle"}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-semibold text-gray-700 transition disabled:opacity-60"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {estado === "google" ? "Conectando..." : "Continuar con Google"}
      </button>

      {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
    </div>
  );
}
