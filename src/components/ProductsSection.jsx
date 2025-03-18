"use client";
import { motion } from 'framer-motion';

const specialties = [
  { title: 'Tortas Personalizadas', desc: 'Hechas a medida, libres de gluten, lácteos y maíz.' },
  { title: 'Galletas Artesanales', desc: 'Deliciosas y saludables, sin conservantes artificiales.' },
  { title: 'Brownies', desc: 'Intensos en sabor y aptos para dietas especiales.' },
  { title: 'Suspiros', desc: 'Ligereza dulce sin gluten, ideales para cualquier ocasión.' },
];

export default function ProductsSection() {
  return (
    <section className="py-16 container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-rose-300">Nuestras Especialidades</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {specialties.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg rounded-xl"
          >
            <div className='w-full aspect-video overflow-hidden relative rounded-t-xl'>
              <img src={`/images/prod${idx + 1}.jpg`} className='absolute object-cover left-[50%] top-[50%] -translate-[50%] rounded-t-xl' />
            </div>
            <div className='p-6'>
              <h3 className="font-bold text-xl mb-3 text-sky-500">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
