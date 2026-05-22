import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-2xl p-10 bg-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">404</p>
        <h1 className="mt-4 text-3xl font-black text-[color:var(--text)]">Página não encontrada</h1>
        <p className="mt-3 muted">A rota solicitada não existe. Volte para a Home ou abra o catálogo.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Home</Link>
          <Link to="/catalogo" className="btn-ghost">Catálogo</Link>
        </div>
      </div>
    </div>
  );
}
