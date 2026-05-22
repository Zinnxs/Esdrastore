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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Carrinho</p>
          <h1 className="mt-2 text-3xl font-black text-[#f8f1e3] sm:text-5xl">Revise seus itens</h1>
        </div>
        <p className="rounded-full bg-[#f2e7d5] px-4 py-2 text-sm font-semibold text-[#111827]">
          {totalItems} item(ns)
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.cartId} className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#171717] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.25)] sm:flex-row">
                <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover sm:w-28" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[#f8f1e3]">{item.name}</h2>
                      <p className="text-sm text-[#d8c8aa]">
                        Tamanho {item.size} • Cor {item.color}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#f8f1e3]">{formatCurrency(item.price * item.quantity)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-[#0b1020]">
                      <button
                        type="button"
                        onClick={() => decrementCartItem(item.cartId)}
                        className="px-4 py-2 text-sm font-semibold text-[#f2e7d5]"
                      >
                        -
                      </button>
                      <span className="min-w-12 px-4 py-2 text-center text-sm font-semibold text-[#f8f1e3]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementCartItem(item.cartId)}
                        className="px-4 py-2 text-sm font-semibold text-[#f2e7d5]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartId)}
                      className="rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Resumo</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-[#d8c8aa]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#f8f1e3]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#d8c8aa]">
                <span>Frete</span>
                <span className="font-semibold text-[#f2e7d5]">Calculado no checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold text-[#f8f1e3]">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5"
            >
              Ir para Pagamento
            </button>
            <Link
              to="/catalogo"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-[#0b1020] px-6 py-3 text-sm font-semibold text-[#f8f1e3]"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-white/20 bg-[#111827] p-10 text-center">
          <p className="text-2xl font-bold text-[#f8f1e3]">Seu carrinho está vazio.</p>
          <p className="mt-2 text-[#d8c8aa]">Adicione produtos do catálogo para iniciar a compra.</p>
          <Link
            to="/catalogo"
            className="mt-6 inline-flex rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]"
          >
            Ver catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
