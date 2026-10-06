import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { IngredientesChecklist, PasosChecklist } from "./Checklist";

export default function RecetaView({ receta, anterior, siguiente }) {
  return (
    <article className="space-y-10">
      <header>
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-500">
          {receta.categoria}
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-cyan-600">
          {receta.titulo}
        </h1>
        {receta.subtitulo && (
          <p className="mt-1 text-lg text-cyan-800">{receta.subtitulo}</p>
        )}
        <p className="mt-3 text-blue-900 max-w-3xl">{receta.resumen}</p>

        {receta.ficha.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-3">
            {receta.ficha.map(({ etiqueta, valor }) => (
              <div
                key={etiqueta}
                className="rounded-xl bg-white px-4 py-2 shadow-sm border border-sky-100"
              >
                <dt className="text-xs text-gray-500">{etiqueta}</dt>
                <dd className="font-semibold text-cyan-800">{valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {receta.tabla && (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-sky-100 text-cyan-800">
              <tr>
                {receta.tabla.columnas.map((col) => (
                  <th key={col} className="px-4 py-3 font-merienda font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receta.tabla.filas.map((fila, idx) => (
                <tr key={idx} className="border-t border-sky-50">
                  {fila.map((celda, cidx) => (
                    <td key={cidx} className="px-4 py-3">
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`grid gap-6 ${
          receta.materiales.length > 0 ? "xl:grid-cols-2" : ""
        }`}
      >
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-cyan-600 mb-4">Ingredientes</h2>
          <div className="space-y-6">
            {receta.ingredientes.map((grupo, idx) => (
              <div key={idx}>
                {grupo.titulo && (
                  <h3 className="mb-3 font-semibold text-cyan-800">{grupo.titulo}</h3>
                )}
                <IngredientesChecklist items={grupo.items} />
              </div>
            ))}
          </div>
        </section>

        {receta.materiales.length > 0 && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-cyan-600 mb-4">Materiales</h2>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-sky-400">
              {receta.materiales.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-cyan-600">Preparación paso a paso</h2>
        {receta.preparacion.map((seccion, idx) => (
          <div key={idx}>
            {seccion.titulo && (
              <h3 className="mb-4 text-lg font-semibold text-cyan-800">
                {seccion.titulo}
              </h3>
            )}
            <PasosChecklist pasos={seccion.pasos} />
          </div>
        ))}
      </section>

      {receta.notas.length > 0 && (
        <aside className="rounded-2xl border-l-4 border-cyan-400 bg-sky-50 p-5">
          <h2 className="font-bold text-cyan-700 mb-2">Notas</h2>
          <ul className="space-y-1">
            {receta.notas.map((nota) => (
              <li key={nota}>{nota}</li>
            ))}
          </ul>
        </aside>
      )}

      <nav className="flex flex-col sm:flex-row gap-4 justify-between border-t border-sky-100 pt-6">
        {anterior ? (
          <Link
            href={`/recetario/${anterior.slug}`}
            className="flex items-center gap-2 text-cyan-700 hover:text-sky-500 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 shrink-0" />
            {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link
            href={`/recetario/${siguiente.slug}`}
            className="flex items-center gap-2 text-cyan-700 hover:text-sky-500 transition sm:text-right"
          >
            {siguiente.titulo}
            <ArrowRightIcon className="h-5 w-5 shrink-0" />
          </Link>
        )}
      </nav>
    </article>
  );
}
