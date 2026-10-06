export const SESSION_COOKIE = "__session";

export function safeNext(next, fallback = "/recetario") {
  if (typeof next !== "string") return fallback;
  if (next === "/admin" || next.startsWith("/admin/")) return next;
  if (!next.startsWith("/recetario") || next.startsWith("//")) return fallback;
  if (next.startsWith("/recetario/acceso") || next.startsWith("/recetario/pago")) {
    return fallback;
  }
  return next;
}

export function conNext(path, next) {
  const destino = safeNext(next);
  return destino === "/recetario"
    ? path
    : `${path}?next=${encodeURIComponent(destino)}`;
}
