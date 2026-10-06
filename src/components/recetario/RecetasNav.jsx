"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function useSlugActivo() {
  const pathname = usePathname();
  const [, , slug] = pathname.split("/");
  return slug ?? "";
}

function agrupar(recetas) {
  return recetas.reduce((grupos, receta) => {
    (grupos[receta.categoria] ??= []).push(receta);
    return grupos;
  }, {});
}

export function RecetasSidebar({ recetas }) {
  const activo = useSlugActivo();

  return (
    <nav className="space-y-6">
      <Link
        href="/recetario"
        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-merienda transition ${
          activo === ""
            ? "bg-cyan-500 text-white"
            : "text-cyan-700 hover:bg-sky-100"
        }`}
      >
        <BookOpenIcon className="h-5 w-5" />
        Portada
      </Link>
      {Object.entries(agrupar(recetas)).map(([categoria, items]) => (
        <div key={categoria}>
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {categoria}
          </p>
          <ul className="space-y-1">
            {items.map((receta) => (
              <li key={receta.slug}>
                <Link
                  href={`/recetario/${receta.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm leading-snug transition ${
                    activo === receta.slug
                      ? "bg-cyan-500 text-white font-semibold"
                      : "text-cyan-950 hover:bg-sky-100"
                  }`}
                >
                  {receta.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function RecetasSelect({ recetas }) {
  const activo = useSlugActivo();
  const router = useRouter();

  return (
    <div className="sticky top-18 z-40 flex items-center gap-2 bg-white/95 backdrop-blur border-b border-sky-100 px-4 py-3 lg:hidden">
      <Link
        href="/recetario"
        aria-label="Portada del recetario"
        title="Portada del recetario"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition ${
          activo === ""
            ? "border-cyan-500 bg-cyan-500 text-white"
            : "border-sky-200 bg-white text-cyan-700 hover:bg-sky-100"
        }`}
      >
        <BookOpenIcon className="h-5 w-5" />
      </Link>
      <label htmlFor="receta-select" className="sr-only">
        Elige una receta
      </label>
      <select
        id="receta-select"
        value={activo}
        onChange={(e) => router.push(`/recetario/${e.target.value}`)}
        className={`min-w-0 flex-1 rounded-lg border border-sky-200 bg-white px-3 py-2.5 font-semibold outline-none focus:border-cyan-500 ${
          activo === "" ? "text-gray-400" : "text-cyan-900"
        }`}
      >
        <option value="" disabled hidden>
          Elige una receta
        </option>
        {Object.entries(agrupar(recetas)).map(([categoria, items]) => (
          <optgroup key={categoria} label={categoria}>
            {items.map((receta) => (
              <option key={receta.slug} value={receta.slug} className="text-cyan-900">
                {receta.titulo}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
