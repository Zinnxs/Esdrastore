import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Produto } from './pages/Produto';
import { Carrinho } from './pages/Carrinho';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Pedidos } from './pages/Pedidos';
import { StripeSuccess } from './pages/StripeSuccess';
import { NotFound } from './pages/NotFound';
import { RequireRole } from './components/RequireRole';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="produto/:id" element={<Produto />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route
          path="pedidos"
          element={
            <RequireRole allowedRoles={[ 'customer', 'admin' ]}>
              <Pedidos />
            </RequireRole>
          }
        />
        <Route path="stripe/sucesso" element={<StripeSuccess />} />
        <Route
          path="checkout"
          element={
            <RequireRole allowedRoles={[ 'customer', 'admin' ]}>
              <Checkout />
            </RequireRole>
          }
        />
        <Route
          path="admin"
          element={
            <RequireRole allowedRoles={[ 'admin' ]}>
              <Admin />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
