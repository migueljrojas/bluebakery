"use client";
import { motion } from "framer-motion";
import styles from "./components.module.css";

export default function TestimonialsSection() {
  return (
    <section className=" py-16 relative" id="testimonios">
      <div className={styles["mask-wrapper"] + " " + styles["mask-top"]}>
        <div
          className={
            "bg-gradient-to-b from-rose-400 to-rose-600" +
            " " +
            styles["mask-inner"] +
            " " +
            styles["mask-bottom"]
          }
        ></div>
      </div>
      <div className="container mx-auto text-center text-white relative z-10 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-8"
        >
          Lo que dicen nuestros clientes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="italic max-w-2xl mx-auto"
        >
          "Nunca pensé que algo sin gluten pudiera saber tan bien. Los productos
          de Blue Bakery superaron mis expectativas en calidad y sabor.
          ¡Totalmente recomendados!"
        </motion.p>
        <span className="block mt-6 font-bold">— María Rodríguez</span>
      </div>
    </section>
  );
}
