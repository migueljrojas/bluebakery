import { notFound } from "next/navigation";
import { requireRecetarioAccess } from "@/lib/auth";
import { getIndiceRecetas, getReceta } from "@/data/recetas";
import RecetaView from "@/components/recetario/RecetaView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const receta = getReceta(slug);
  return {
    title: receta
      ? `${receta.titulo} | Recetario Blue Bakery`
      : "Recetario | Blue Bakery",
    robots: { index: false },
  };
}

export default async function RecetaPage({ params }) {
  const { slug } = await params;
  await requireRecetarioAccess(`/recetario/${slug}`);

  const receta = getReceta(slug);
  if (!receta) notFound();

  const indice = getIndiceRecetas();
  const posicion = indice.findIndex((r) => r.slug === slug);

  return (
    <RecetaView
      key={slug}
      receta={receta}
      anterior={indice[posicion - 1]}
      siguiente={indice[posicion + 1]}
    />
  );
}
