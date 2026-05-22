import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-[#111827] p-10 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">404</p>
        <h1 className="mt-4 text-3xl font-black text-[#f8f1e3]">Página não encontrada</h1>
        <p className="mt-3 text-[#d8c8aa]">A rota solicitada não existe. Volte para a Home ou abra o catálogo.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]">
            Home
          </Link>
          <Link to="/catalogo" className="rounded-full border border-white/10 bg-[#0b1020] px-6 py-3 text-sm font-semibold text-[#f8f1e3]">
            Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
