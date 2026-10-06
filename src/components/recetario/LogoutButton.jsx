"use client";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function LogoutButton({ conTexto = false, title }) {
  const [saliendo, setSaliendo] = useState(false);

  const handleLogout = async () => {
    setSaliendo(true);
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getFirebaseAuth()).catch(() => {});
    window.location.assign("/");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={saliendo}
      title={title ? `Cerrar sesión (${title})` : "Cerrar sesión"}
      aria-label="Cerrar sesión"
      className="flex items-center gap-1 text-cyan-700 hover:text-sky-500 transition disabled:opacity-50"
    >
      <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
      {conTexto && <span>Cerrar sesión</span>}
    </button>
  );
}
