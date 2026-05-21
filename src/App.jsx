import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Produto } from './pages/Produto';
import { Carrinho } from './pages/Carrinho';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="produto/:id" element={<Produto />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
