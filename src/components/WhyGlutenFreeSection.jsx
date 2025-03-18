"use client";
import { motion } from 'framer-motion';
import styles from './components.module.css'

export default function WhyGlutenFreeSection() {
  return (
    <section className={"py-20 px-6 relative"}>
      <div className={styles['mask-wrapper'] + ' ' + styles['mask-top']}>
        <div className={'bg-gradient-to-b from-sky-400 to-cyan-600'+ ' '+ styles['mask-inner'] + ' ' + styles['mask-bottom']}>
        </div>
      </div>
      <div className={"container mx-auto relative z-10 py-16"}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-bold mb-6 text-white"
        >
          ¿Por qué elegir Gluten Free?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-white text-center max-w-3xl mx-auto"
        >
          Nuestros productos sin gluten facilitan una digestión saludable y segura, ofreciendo una experiencia llena de sabor que sorprende incluso a quienes no tienen restricciones dietéticas.
        </motion.p>
      </div>
    </section>
  )
}
