"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const LogoutButton = dynamic(() => import("@/components/recetario/LogoutButton"), {
  ssr: false,
});

const links = [
  { name: "Inicio", href: "#inicio" },
  { name: "Especialidades", href: "#especialidades" },
  { name: "Galería", href: "#galeria" },
  { name: "Testimonios", href: "#testimonios" },
  { name: "Listado de Productos", href: "#precios" },
  { name: "Contacto", href: "#contacto" },
];

function AdminLink({ pendientes, onClick, className = "" }) {
  return (
    <Link
      href="/admin"
      onClick={onClick}
      title={`Panel de pagos: ${pendientes} pendiente${pendientes === 1 ? "" : "s"}`}
      className={`relative inline-flex items-center gap-2 text-cyan-700 hover:text-sky-500 transition ${className}`}
    >
      <ClipboardDocumentCheckIcon className="h-6 w-6" />
      <span className="lg:hidden">Pagos</span>
      {pendientes > 0 && (
        <span className="absolute -top-2 left-4 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-xs leading-5 text-center font-abeeze">
          {pendientes}
        </span>
      )}
    </Link>
  );
}

export default function Navbar({ userEmail, pendientesAdmin }) {
  const esAdmin = typeof pendientesAdmin === "number";
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const enRecetario = pathname.startsWith("/recetario");

  const hrefDe = (href) => (isHome ? href : `/${href}`);

  const handleClick = (e, href) => {
    setIsOpen(false);
    if (!isHome) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 h-18 flex justify-between items-center">
        <Link href={hrefDe("#inicio")} onClick={(e) => handleClick(e, "#inicio")}>
          <Image
            src="/images/logo.png"
            alt="Blue Bakery"
            width={120}
            height={50}
            priority
          />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-sky-500"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-gray-700 font-semibold">
          {links.map((link) => (
            <Link
              key={link.name}
              href={hrefDe(link.href)}
              onClick={(e) => handleClick(e, link.href)}
              className={`hover:text-sky-500 transition ${
                link.href === "#inicio" ? "hidden xl:inline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/recetario"
            className={`rounded-full px-4 py-1.5 transition ${
              enRecetario
                ? "bg-cyan-500 text-white"
                : "text-cyan-600 ring-1 ring-cyan-500 hover:bg-cyan-500 hover:text-white"
            }`}
          >
            Recetario
          </Link>
          {esAdmin && <AdminLink pendientes={pendientesAdmin} />}
          {userEmail && <LogoutButton title={userEmail} />}
        </div>

        {/* Menú Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed inset-0 top-18 bg-rose-50 flex flex-col items-center justify-center space-y-6 lg:hidden shadow-lg"
            >
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={hrefDe(link.href)}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-xl text-cyan-700 hover:text-rose-500 transition font-semibold"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/recetario"
                onClick={() => setIsOpen(false)}
                className="text-xl bg-cyan-500 text-white px-6 py-2 rounded-full font-semibold"
              >
                Recetario
              </Link>
              {esAdmin && (
                <AdminLink
                  pendientes={pendientesAdmin}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-semibold"
                />
              )}
              {userEmail && (
                <div className="flex flex-col items-center gap-2 pt-4 border-t border-rose-200">
                  <span className="text-sm text-gray-500">{userEmail}</span>
                  <LogoutButton conTexto />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <a
        href="https://wa.me/584166059378"
        target="_blank"
        className="fixed z-50 bottom-6 right-6 inline-block rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 175.216 175.552"
          className="w-16 h-16"
        >
          <defs>
            <linearGradient
              id="b"
              x1="85.915"
              x2="86.535"
              y1="32.567"
              y2="137.092"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#57d163" />
              <stop offset="1" stopColor="#23b33a" />
            </linearGradient>
            <filter
              id="a"
              width="1.115"
              height="1.114"
              x="-.057"
              y="-.057"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="3.531" />
            </filter>
          </defs>
          <path
            fill="#b3b3b3"
            d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
            filter="url(#a)"
          />
          <path
            fill="#fff"
            d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
          />
          <path
            fill="url(#linearGradient1780)"
            d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
          />
          <path
            fill="url(#b)"
            d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
          />
        </svg>
      </a>
    </nav>
  );
}
