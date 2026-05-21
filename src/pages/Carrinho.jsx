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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Carrinho</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Revise seus itens</h1>
        </div>
        <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
          {totalItems} item(ns)
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.cartId} className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover sm:w-28" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="text-sm text-slate-500">
                        Tamanho {item.size} • Cor {item.color}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => decrementCartItem(item.cartId)}
                        className="px-4 py-2 text-sm font-semibold text-slate-600"
                      >
                        -
                      </button>
                      <span className="min-w-12 px-4 py-2 text-center text-sm font-semibold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementCartItem(item.cartId)}
                        className="px-4 py-2 text-sm font-semibold text-slate-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartId)}
                      className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Resumo</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Frete</span>
                <span className="font-semibold text-emerald-700">Calculado no checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Ir para Pagamento
            </button>
            <Link
              to="/catalogo"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-2xl font-bold text-slate-900">Seu carrinho está vazio.</p>
          <p className="mt-2 text-slate-500">Adicione produtos do catálogo para iniciar a compra.</p>
          <Link
            to="/catalogo"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Ver catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
