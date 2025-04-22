export default function ContactSection() {
  return (
    <section
      className="bg-cyan-400 py-16 text-white text-center relative overflow-hidden"
      id="contacto"
    >
      <img
        src="/images/contact.jpg"
        className="absolute object-center top-[50%] left-[50%] -translate-[50%] mix-blend-multiply opacity-30"
      />
      <div className="z-10 relative">
        <h2 className="text-3xl font-bold">¿Listo para probar?</h2>
        <p className="mt-2">¡Pide información fácilmente desde WhatsApp!</p>
        <a
          href="https://wa.me/584166059378"
          target="_blank"
          className="mt-6 inline-block bg-white text-cyan-400 py-3 px-6 rounded"
        >
          Pedir Información
        </a>
      </div>
    </section>
  );
}
