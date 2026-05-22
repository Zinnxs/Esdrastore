import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function Carrinho() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const incrementCartItem = useStore((state) => state.incrementCartItem);
  const decrementCartItem = useStore((state) => state.decrementCartItem);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const subtotal = useStore((state) => state.getCartSubtotal());

  const totalItems = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Carrinho</p>
          <h1 className="mt-2 text-3xl font-black text-[color:var(--text)] sm:text-5xl">Revise seus itens</h1>
        </div>
        <p className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white">{totalItems} item(ns)</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.cartId} className="flex flex-col gap-4 product-card p-4 sm:flex-row">
                <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover sm:w-28" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[color:var(--text)]">{item.name}</h2>
                      <p className="text-sm muted">Tamanho {item.size} • Cor {item.color}</p>
                    </div>
                    <p className="text-lg font-bold text-[color:var(--text)]">{formatCurrency(item.price * item.quantity)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border bg-white">
                      <button type="button" onClick={() => decrementCartItem(item.cartId)} className="px-4 py-2 text-sm font-semibold">-</button>
                      <span className="min-w-12 px-4 py-2 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => incrementCartItem(item.cartId)} className="px-4 py-2 text-sm font-semibold">+</button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.cartId)} className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Resumo</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between muted">
                <span>Subtotal</span>
                <span className="font-semibold text-[color:var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between muted">
                <span>Frete</span>
                <span className="font-semibold muted">Calculado no checkout</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4 text-lg font-bold text-[color:var(--text)]">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/checkout')} className="mt-6 btn-primary w-full">
              Ir para Pagamento
            </button>
            <Link to="/catalogo" className="mt-3 btn-ghost w-full inline-flex items-center justify-center">
              Continuar comprando
            </Link>
          </aside>
        </div>
      ) : (
        <div className="rounded-2xl p-10 text-center bg-white shadow-sm">
          <p className="text-2xl font-bold text-[color:var(--text)]">Seu carrinho está vazio.</p>
          <p className="mt-2 muted">Adicione produtos do catálogo para iniciar a compra.</p>
          <Link to="/catalogo" className="mt-6 btn-primary inline-flex">
            Ver catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
