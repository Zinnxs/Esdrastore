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
  const discount = subtotal * 0.2;
  const deliveryFee = cart.length > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Cart</p>
          <h1 className="shop-title sm:max-w-none">YOUR CART</h1>
        </div>
        <p className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">{totalItems} item(ns)</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.cartId} className="flex flex-col gap-4 panel p-4 sm:flex-row">
                <div className="h-28 w-full rounded-[20px] bg-[#f2f0f1] p-3 sm:w-28">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-[-0.03em] text-black">{item.name}</h2>
                      <p className="text-sm muted">Tamanho {item.size} • Cor {item.color}</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.cartId)} className="text-rose-500" aria-label="Remover item">
                      🗑
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="shop-quantity">
                      <button type="button" onClick={() => decrementCartItem(item.cartId)}>−</button>
                      <span className="min-w-12 px-4 text-center text-sm font-semibold text-black">{item.quantity}</span>
                      <button type="button" onClick={() => incrementCartItem(item.cartId)}>+</button>
                    </div>
                    <p className="text-lg font-black text-black">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="panel h-fit p-6">
            <p className="text-lg font-black uppercase tracking-[-0.04em] text-black">Order Summary</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-black/60">
                <span>Subtotal</span>
                <span className="font-semibold text-[color:var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#ff5353]">
                <span>Discount (-20%)</span>
                <span className="font-semibold">-{formatCurrency(discount)}</span>
              </div>
              <div className="flex items-center justify-between text-black/60">
                <span>Delivery Fee</span>
                <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4 text-lg font-black text-black">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
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
        <div className="panel p-10 text-center">
          <p className="text-2xl font-black text-black">Seu carrinho está vazio.</p>
          <p className="mt-2 muted">Adicione produtos do catálogo para iniciar a compra.</p>
          <Link to="/catalogo" className="mt-6 btn-primary inline-flex">
            Ver catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
