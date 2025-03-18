"use client";
import { motion } from 'framer-motion';

const prices = [
  { title: 'Tortas Personalizadas', price: 'Desde $25', features: ['Sin Gluten', 'Sin Lácteos', 'Sabores a elección'] },
  { title: 'Galletas', price: 'Desde $8', features: ['Pack 12 unidades', 'Sabores variados', '100% Artesanal'] },
  { title: 'Brownies', price: 'Desde $10', features: ['Pack 6 unidades', 'Chocolate Premium', 'Sin conservantes'] },
];

export default function PricingSection() {
  return (
    <section className="py-16 container mx-auto px-10 shadow-lg">
      <h2 className="text-center text-4xl font-bold mb-12 text-cyan-500">Precios y Pedidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {prices.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="bg-white shadow-xl rounded-xl p-6 text-center"
          >
            <h3 className="text-2xl font-bold text-cyan-600">{item.title}</h3>
            <p className="mt-2 font-semibold text-teal-500">{item.price}</p>
            <ul className="mt-4 text-gray-600 space-y-1">
              {item.features.map((feat, fidx) => (
                <li key={fidx}>{feat}</li>
              ))}
            </ul>
            <a href="https://wa.me/584166059378" target="_blank"
              className="inline-block mt-6 bg-cyan-500 text-white px-4 py-2 rounded"
            >
              Pedir Ahora
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
