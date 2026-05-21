import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,250,252,1),_rgba(226,232,240,0.7)_38%,_rgba(248,250,252,1)_100%)] text-slate-900">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
