'use client';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Especialidades', href: '#especialidades' },
  { name: 'Galería', href: '#galeria' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Precios', href: '#precios' },
  { name: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="#inicio" onClick={(e) => handleClick(e, '#inicio')}>
          <Image src="/images/logo.png" alt="Blue Bakery" width={120} height={50} priority />
        </Link>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-sky-500">
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
        </button>

        {/* Menú Desktop */}
        <div className="hidden lg:flex space-x-8 text-gray-700 font-semibold">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="hover:text-sky-500 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Menú Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="fixed inset-0 top-14 bg-rose-50 flex flex-col items-center justify-center space-y-6 lg:hidden shadow-lg"
            >
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-xl text-cyan-700 hover:text-rose-500 transition font-semibold"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
