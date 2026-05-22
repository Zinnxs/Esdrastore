import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/useStore';

const linkClass = ({ isActive }) =>
  [
    'nav-link',
    isActive ? 'nav-link--active' : '',
  ].join(' ');

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useStore((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const session = useStore((state) => state.session);
  const logout = useStore((state) => state.logout);
  const isLoggedIn = session.role === 'customer' || session.role === 'admin';

  const navigationItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/carrinho', label: 'Carrinho' },
    { to: '/checkout', label: 'Checkout' },
    { to: '/pedidos', label: 'Pedidos' },
    { to: '/login', label: 'Usuário' },
  ];

  return (
    <header className="site-header">
      <div className="top-promo">
        <span>Sign up and get 20% off your first order. Sign Up Now</span>
      </div>

      <div className="header-row">
        <button type="button" className="icon-btn lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menu">
          <IconMenu />
        </button>

        <NavLink to="/" className="flex items-center gap-1">
          <span className="brand-wordmark">Esdras Store</span>
        </NavLink>

        <nav className="header-nav lg:flex">
          <NavLink to="/catalogo" className={linkClass}>
            Shop <Chevron />
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            On Sale
          </NavLink>
          <NavLink to="/pedidos" className={linkClass}>
            New Arrivals
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Brands
          </NavLink>
        </nav>

        <div className="hidden flex-1 max-w-[560px] lg:block">
          <label className="search-box">
            <SearchIcon />
            <input type="search" aria-label="Search for products" placeholder="Search for products..." />
          </label>
        </div>

        <div className="header-actions ml-auto lg:ml-0">
          <button type="button" className="icon-btn lg:hidden" aria-label="Pesquisar">
            <SearchIcon />
          </button>
          <NavLink to="/carrinho" className="icon-btn relative" aria-label="Carrinho">
            <CartIcon />
            {cartCount > 0 ? <span className="cart-badge absolute -right-1 -top-1">{cartCount}</span> : null}
          </NavLink>
          <button type="button" className="icon-btn" aria-label="Perfil">
            <UserIcon />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 lg:hidden">
          <div className="panel p-3">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {isLoggedIn ? (
                <button type="button" onClick={logout} className="btn-ghost mt-2">
                  Sair
                </button>
              ) : (
                <NavLink to="/login" className="btn-primary mt-2" onClick={() => setMenuOpen(false)}>
                  Entrar
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 opacity-80">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c1.5-3 4-4 6-4s4.5 1 6 4" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
