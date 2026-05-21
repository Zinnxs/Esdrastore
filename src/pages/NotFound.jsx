import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">404</p>
        <h1 className="mt-4 text-3xl font-black text-slate-950">Página não encontrada</h1>
        <p className="mt-3 text-slate-600">A rota solicitada não existe. Volte para a Home ou abra o catálogo.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Home
          </Link>
          <Link to="/catalogo" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900">
            Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
