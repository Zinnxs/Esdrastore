import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="pb-10">
        <Outlet />
      </main>
      <footer className="brand-strip">
        <div className="brand-strip__inner">
          <span className="brand-strip__name">VERSACE</span>
          <span className="brand-strip__name">ZARA</span>
          <span className="brand-strip__name">GUCCI</span>
          <span className="brand-strip__name">PRADA</span>
          <span className="brand-strip__name">Calvin Klein</span>
        </div>
      </footer>
    </div>
  );
}
