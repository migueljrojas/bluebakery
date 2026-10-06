"use client";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export function IngredientesChecklist({ items }) {
  const [marcados, setMarcados] = useState(() => new Set());

  const toggle = (idx) =>
    setMarcados((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => {
        const hecho = marcados.has(idx);
        return (
          <li key={idx}>
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                  hecho ? "bg-cyan-500 border-cyan-500" : "border-sky-300 bg-white"
                }`}
              >
                {hecho && <CheckIcon className="h-4 w-4 text-white" />}
              </span>
              <span className={hecho ? "text-gray-400 line-through" : ""}>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PasosChecklist({ pasos }) {
  const [hechos, setHechos] = useState(() => new Set());

  const toggle = (idx) =>
    setHechos((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  return (
    <ol className="space-y-4">
      {pasos.map((paso, idx) => {
        const hecho = hechos.has(idx);
        return (
          <li key={idx}>
            <button
              onClick={() => toggle(idx)}
              className={`flex w-full items-start gap-4 rounded-2xl p-5 text-left shadow-sm transition ${
                hecho ? "bg-sky-50" : "bg-white hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-merienda font-bold transition ${
                  hecho ? "bg-cyan-500 text-white" : "bg-sky-100 text-cyan-600"
                }`}
              >
                {hecho ? <CheckIcon className="h-5 w-5" /> : idx + 1}
              </span>
              <span
                className={`pt-1.5 leading-relaxed ${
                  hecho ? "text-gray-400" : "text-cyan-950"
                }`}
              >
                {paso}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
