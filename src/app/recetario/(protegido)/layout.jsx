import { headers } from "next/headers";
import { requireRecetarioAccess } from "@/lib/auth";
import { getIndiceRecetas } from "@/data/recetas";
import { getPendientesAdmin } from "@/lib/pagos/estado";
import Navbar from "@/components/Navbar";
import { RecetasSidebar, RecetasSelect } from "@/components/recetario/RecetasNav";

export const metadata = {
  title: "Recetario | Blue Bakery",
  robots: { index: false },
};

export default async function RecetarioLayout({ children }) {
  const pathname = (await headers()).get("x-pathname") ?? "/recetario";
  const user = await requireRecetarioAccess(pathname);
  const recetas = getIndiceRecetas();
  const pendientesAdmin = await getPendientesAdmin(user.email);

  return (
    <>
      <Navbar userEmail={user.email} pendientesAdmin={pendientesAdmin} />
      <div className="pt-18 min-h-screen bg-sky-50/50">
        <RecetasSelect recetas={recetas} />
        <div className="container mx-auto px-4 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="hidden lg:block sticky top-18 h-[calc(100vh-4.5rem)] overflow-y-auto py-8 pr-2">
            <RecetasSidebar recetas={recetas} />
          </aside>
          <main className="min-w-0 py-6 lg:py-10">{children}</main>
        </div>
      </div>
    </>
  );
}
