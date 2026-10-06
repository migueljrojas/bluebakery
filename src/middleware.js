import { NextResponse } from "next/server";
import { SESSION_COOKIE, conNext } from "@/lib/rutas";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/recetario/acceso")) return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    const url = new URL(conNext("/recetario/acceso", pathname), request.url);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/recetario", "/recetario/:path*", "/admin", "/admin/:path*"],
};
