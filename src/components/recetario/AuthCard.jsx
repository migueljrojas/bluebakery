export default function AuthCard({ title, subtitle, children }) {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-sky-50 bg-[url(/images/hero.jpg)] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative z-10 mx-auto max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-cyan-500 text-center">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-center text-blue-900">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
