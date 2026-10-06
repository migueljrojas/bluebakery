import "server-only";

const DOLAR_API_EURO_BCV = "https://ve.dolarapi.com/v1/euros/oficial";

export function getPrecioUsd() {
  const precio = Number(process.env.RECETARIO_PRECIO_USD ?? 5);
  return Number.isFinite(precio) && precio > 0 ? precio : 5;
}

export async function getTasaEuroBcv() {
  const res = await fetch(DOLAR_API_EURO_BCV, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`DolarAPI respondió ${res.status}`);
  const data = await res.json();
  if (!data?.promedio) throw new Error("DolarAPI no devolvió la tasa");
  return { tasa: Number(data.promedio), fecha: data.fechaActualizacion };
}

export async function getMontoBs() {
  const { tasa, fecha } = await getTasaEuroBcv();
  const montoBs = Math.ceil(getPrecioUsd() * tasa * 100) / 100;
  return { montoBs, tasa, fecha };
}
