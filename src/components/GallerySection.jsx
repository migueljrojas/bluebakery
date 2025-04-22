"use client";
import { motion } from "framer-motion";

const images = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
];

export default function GallerySection() {
  return (
    <section
      id="galeria"
      className="pt-16 pb-16 md:pb-30 container mx-auto px-4"
    >
      <h2 className="text-center text-4xl font-bold mb-12 text-rose-300">
        Nuestras Creaciones
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {images.map((src, idx) => (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            src={src}
            key={idx}
            alt={`gallery-${idx}`}
            className="rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:rotate-6 transition-all"
          />
        ))}
      </div>
    </section>
  );
}
