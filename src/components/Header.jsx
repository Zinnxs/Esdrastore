import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';

const linkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white shadow-glow' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

export function Header() {
  const cartCount = useStore((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const session = useStore((state) => state.session);
  const logout = useStore((state) => state.logout);

  const isLoggedIn = session.role === 'customer' || session.role === 'admin';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-glow">
            E
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Esdras Store</p>
            <p className="text-base font-semibold text-slate-900">Moda urbana</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>
          <NavLink to="/carrinho" className={linkClass}>
            Carrinho
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            Checkout
          </NavLink>
          <NavLink to="/pedidos" className={linkClass}>
            Pedidos
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Usuário
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 sm:flex">
              <span>
                {session.name || 'Usuário'} • {session.role === 'admin' ? 'Admin' : 'Cliente'}
              </span>
              <button type="button" onClick={logout} className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4">
                Sair
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 sm:inline-flex"
            >
              Entrar
            </NavLink>
          )}

          <NavLink
            to="/carrinho"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <span>Carrinho</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{cartCount}</span>
          </NavLink>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 md:hidden">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/catalogo" className={linkClass}>
          Catálogo
        </NavLink>
        <NavLink to="/carrinho" className={linkClass}>
          Carrinho
        </NavLink>
        <NavLink to="/checkout" className={linkClass}>
          Checkout
        </NavLink>
        <NavLink to="/pedidos" className={linkClass}>
          Pedidos
        </NavLink>
        <NavLink to="/login" className={linkClass}>
          Usuário
        </NavLink>
      </div>
    </header>
  );
}
