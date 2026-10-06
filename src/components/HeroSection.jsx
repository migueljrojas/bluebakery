"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import styles from "./components.module.css";

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className={`bg-sky-50 pt-24 bg-[url(/images/hero.jpg)] bg-no-repeat bg-center bg-cover relative`}
    >
      <div className="bg-white absolute left-0 right-0 top-0 bottom-0 opacity-50"></div>
      <img
        src="/images/logo-vert.png"
        className={
          "mb-12 max-w-10/12 md:w-1/4 md:max-w-xl mx-auto z-10 relative " +
          styles.logo
        }
      />
      <div className="text-center relative z-10 bg-gradient-to-t from-white from-20% to-transparent pb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={"text-5xl font-bold text-cyan-500 " + styles.tagline}
        >
          100% Sabor, 0% Gluten
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl text-blue-900 mt-4"
        >
          Postres artesanales sin gluten, llenos de sabor y perfectos para
          todos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8"
        >
          <Link
            href="/recetario"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105 font-merienda"
          >
            <BookOpenIcon className="h-6 w-6" />
            Accede al recetario
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
