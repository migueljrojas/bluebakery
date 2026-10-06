import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { safeNext } from "@/lib/rutas";
import Navbar from "@/components/Navbar";
import AuthCard from "@/components/recetario/AuthCard";
import AccesoForm from "@/components/recetario/AccesoForm";

export const metadata = {
  title: "Accede al recetario | Blue Bakery",
  robots: { index: false },
};

export default async function AccesoPage({ searchParams }) {
  const next = safeNext((await searchParams).next);
  if (await getSessionUser()) redirect(next);

  return (
    <>
      <Navbar />
      <AuthCard
        title="Accede al recetario"
        subtitle="Ingresa con tu correo o tu cuenta de Google. Si ya compraste el recetario, entrarás directamente."
      >
        <AccesoForm next={next} />
      </AuthCard>
    </>
  );
}
