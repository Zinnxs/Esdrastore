import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const linkClass = ({ isActive }) =>
  [
    'nav-link',
    isActive ? 'nav-link--active' : '',
  ].join(' ');

export function Header() {
  const cartCount = useStore((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const session = useStore((state) => state.session);
  const logout = useStore((state) => state.logout);

  const isLoggedIn = session.role === 'customer' || session.role === 'admin';

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.classList.toggle('light', initialTheme === 'light');

    return initialTheme;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logosfundo.png" alt="XLS" className="brand-logo" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">XLS</p>
            <p className="text-base font-semibold text-[color:var(--text)]">Neo-brutal streetwear</p>
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
            <div className="hidden items-center gap-3 rounded-full border px-4 py-2 text-sm sm:flex bg-[color:var(--surface)] text-[color:var(--text)]">
              <span>
                {session.name || 'Usuário'} • {session.role === 'admin' ? 'Admin' : 'Cliente'}
              </span>
              <button type="button" onClick={logout} className="font-semibold text-[color:var(--primary)] underline decoration-[color:var(--primary)] underline-offset-4">
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="hidden btn-primary sm:inline-flex">
              Entrar
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="btn-ghost min-w-24"
            aria-label="Alternar tema claro/escuro"
            title={theme === 'dark' ? 'Mudar para tema solar' : 'Mudar para tema lunar'}
          >
            {theme === 'dark' ? 'SOL' : 'LUA'}
          </button>

          <NavLink to="/carrinho" className="inline-flex items-center gap-2 btn-ghost">
            <span>Carrinho</span>
            <span className="cart-badge">{cartCount}</span>
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
