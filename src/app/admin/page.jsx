import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";
import { BANCOS_VE } from "@/lib/bancos";
import Navbar from "@/components/Navbar";
import PagosAdmin from "@/components/admin/PagosAdmin";

export const metadata = {
  title: "Pagos | Admin Blue Bakery",
  robots: { index: false },
};

const ESTADOS = [
  { id: "pendiente", label: "Pendientes" },
  { id: "aprobado", label: "Aprobados" },
  { id: "rechazado", label: "Rechazados" },
];

const formatoFecha = (timestamp) =>
  timestamp?.toDate?.().toLocaleString("es-VE", {
    timeZone: "America/Caracas",
    dateStyle: "short",
    timeStyle: "short",
  }) ?? "";

async function getPagos(estado) {
  const snap = await db().collection("pagos").where("estado", "==", estado).get();
  return snap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        metodo: data.metodo,
        email: data.email,
        montoUsd: data.montoUsd ?? null,
        montoBs: data.montoBs ?? null,
        referencia: data.referencia ?? null,
        telefono: data.telefono ?? null,
        banco: data.bancoOrigen
          ? `${data.bancoOrigen} - ${BANCOS_VE.find((b) => b.codigo === data.bancoOrigen)?.nombre ?? ""}`
          : null,
        fechaPago: data.fecha ?? null,
        pagador: data.pagador ?? null,
        capturaId: data.capturaId ?? null,
        motivo: data.motivo ?? null,
        revisadoPor: data.revisadoPor ?? null,
        creadoEn: formatoFecha(data.creadoEn),
        orden: data.creadoEn?.toMillis?.() ?? 0,
      };
    })
    .sort((a, b) => b.orden - a.orden);
}

async function getConteos() {
  const conteos = await Promise.all(
    ESTADOS.map(({ id }) =>
      db().collection("pagos").where("estado", "==", id).count().get()
    )
  );
  return Object.fromEntries(ESTADOS.map(({ id }, i) => [id, conteos[i].data().count]));
}

export default async function AdminPage({ searchParams }) {
  const user = await requireAdmin();
  const { estado: estadoParam } = await searchParams;
  const estado = ESTADOS.some((e) => e.id === estadoParam) ? estadoParam : "pendiente";
  const [pagos, conteos] = await Promise.all([getPagos(estado), getConteos()]);

  return (
    <>
      <Navbar userEmail={user.email} pendientesAdmin={conteos.pendiente} />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-sky-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-cyan-600">Pagos del recetario</h1>
          <p className="mt-2 text-blue-900">
            Verifica cada pago en el banco o en PayPal antes de aprobarlo. Al
            aprobar, el cliente obtiene acceso de inmediato.
          </p>

          <nav className="mt-6 flex gap-2 flex-wrap">
            {ESTADOS.map((e) => (
              <Link
                key={e.id}
                href={`/admin?estado=${e.id}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  estado === e.id
                    ? "bg-cyan-500 text-white"
                    : "bg-white text-cyan-700 hover:bg-sky-100"
                }`}
              >
                {e.label} ({conteos[e.id]})
              </Link>
            ))}
          </nav>

          <PagosAdmin pagos={pagos} estado={estado} />
        </div>
      </main>
    </>
  );
}
