import { redirect } from "next/navigation";
import { getSessionUser, hasAccess } from "@/lib/auth";
import { getEstadoPago } from "@/lib/pagos/estado";
import { getMontoBs, getPrecioUsd } from "@/lib/tasa";
import { conNext, safeNext } from "@/lib/rutas";
import Navbar from "@/components/Navbar";
import Paywall from "@/components/recetario/Paywall";

export const metadata = {
  title: "Obtén el recetario | Blue Bakery",
  robots: { index: false },
};

async function getCotizacion() {
  try {
    return await getMontoBs();
  } catch (error) {
    console.error("No se pudo obtener la tasa Euro BCV", error);
    return null;
  }
}

export default async function PagoPage({ searchParams }) {
  const next = safeNext((await searchParams).next);
  const user = await getSessionUser();
  if (!user) redirect(conNext("/recetario/acceso", next));
  if (await hasAccess(user.email)) redirect(next);

  const [cotizacion, { pendiente, rechazo }] = await Promise.all([
    getCotizacion(),
    getEstadoPago(user.email),
  ]);

  return (
    <>
      <Navbar userEmail={user.email} />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-sky-50">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-500">
              Obtén el Recetario de Blue Bakery
            </h1>
            <p className="mt-3 text-blue-900">
              Todas las recetas de Blue Bakery explicadas paso a paso. Un solo
              pago de <strong>{getPrecioUsd()} USD</strong> y acceso de por vida
              con tu email: <strong>{user.email}</strong>
            </p>
          </div>
          <Paywall
            next={next}
            email={user.email}
            precioUsd={getPrecioUsd()}
            cotizacion={cotizacion}
            pagoPendiente={pendiente}
            rechazo={rechazo}
            paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ""}
            beneficiario={{
              bancoCodigo: process.env.PAGO_MOVIL_BANCO_CODIGO ?? "0102",
              bancoNombre: process.env.PAGO_MOVIL_BANCO_NOMBRE ?? "Banco de Venezuela",
              telefono: process.env.PAGO_MOVIL_TELEFONO ?? "",
              documento: process.env.PAGO_MOVIL_DOCUMENTO ?? "",
              titular: process.env.PAGO_MOVIL_TITULAR ?? "",
            }}
          />
        </div>
      </main>
    </>
  );
}
