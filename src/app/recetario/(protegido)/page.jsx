import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { requireRecetarioAccess } from "@/lib/auth";
import { getIndiceRecetas } from "@/data/recetas";

export default async function RecetarioPortada() {
  await requireRecetarioAccess("/recetario");
  const recetas = getIndiceRecetas();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-[url(/images/hero.jpg)] bg-cover bg-center shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40" />
        <div className="relative px-6 py-14 md:px-12 md:py-20 text-center">
          <img
            src="/images/logo-vert.png"
            alt="Blue Bakery"
            className="mx-auto mb-6 w-40 md:w-52"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-500">
            Recetario Sin Gluten
          </h1>
          <p className="mt-4 text-lg text-blue-900 max-w-2xl mx-auto">
            {recetas.length} recetas artesanales de Blue Bakery, explicadas paso a
            paso. Empieza por la premezcla y el desmoldante: son la base de todas
            las demás.
          </p>
          <Link
            href={`/recetario/${recetas[0].slug}`}
            className="mt-8 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Empezar a hornear
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-cyan-600 mb-6">Todas las recetas</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {recetas.map((receta) => (
            <Link
              key={receta.slug}
              href={`/recetario/${receta.slug}`}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-500">
                {receta.categoria}
              </span>
              <h3 className="mt-2 text-lg font-bold text-cyan-900 group-hover:text-cyan-500 transition">
                {receta.titulo}
              </h3>
              <p className="mt-2 text-sm text-gray-600 flex-1">{receta.resumen}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600">
                Ver receta
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
