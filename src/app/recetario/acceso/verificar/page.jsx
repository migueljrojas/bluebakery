import { safeNext } from "@/lib/rutas";
import Navbar from "@/components/Navbar";
import AuthCard from "@/components/recetario/AuthCard";
import VerificarEnlace from "@/components/recetario/VerificarEnlace";

export const metadata = {
  title: "Verificando acceso | Blue Bakery",
  robots: { index: false },
};

export default async function VerificarPage({ searchParams }) {
  const next = safeNext((await searchParams).next);

  return (
    <>
      <Navbar />
      <AuthCard title="Accede al recetario">
        <VerificarEnlace next={next} />
      </AuthCard>
    </>
  );
}
