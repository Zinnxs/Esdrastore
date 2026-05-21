import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function StripeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderCount = useStore((state) => state.orders.length);
  const createOrder = useStore((state) => state.createOrder);
  const clearCart = useStore((state) => state.clearCart);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const finalizePayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('O identificador da sessão Stripe não foi encontrado.');
        return;
      }

      try {
        const response = await fetch(`/api/stripe-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Não foi possível confirmar o pagamento.');
        }

        if (cancelled) {
          return;
        }

        setPaymentInfo(data);

        if (data.payment_status !== 'paid') {
          setStatus('pending');
          setMessage('O Stripe ainda não confirmou este pagamento. Atualize a página em alguns instantes.');
          return;
        }

        const storeState = useStore.getState();
        const existingOrder = storeState.orders.find((order) => order.paymentSessionId === sessionId);

        if (!existingOrder) {
          const draftRaw = sessionStorage.getItem('esdras_stripe_checkout');
          const draft = draftRaw ? JSON.parse(draftRaw) : null;
          const storedCustomer = draft?.customer || {
            name: data.customer_details?.name || 'Cliente',
            email: data.customer_details?.email || '',
            cpf: '',
            address: {},
          };
          const storedItems = Array.isArray(draft?.items) && draft.items.length > 0 ? draft.items : storeState.cart;
          const amount = typeof data.amount_total === 'number' ? data.amount_total / 100 : draft?.total || 0;

          createOrder({
            customer: storedCustomer,
            paymentMethod: 'Stripe Checkout',
            total: amount,
            items: storedItems,
            paymentSessionId: sessionId,
          });
          clearCart();
          sessionStorage.removeItem('esdras_stripe_checkout');
        }

        setStatus('success');
        setMessage('Pagamento aprovado. Seu pedido foi registrado com sucesso.');

        window.setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus('error');
        setMessage(error.message || 'Erro ao validar o pagamento.');
      }
    };

    finalizePayment();

    return () => {
      cancelled = true;
    };
  }, [clearCart, createOrder, navigate, sessionId]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Stripe Checkout</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">
          {status === 'success' ? 'Pagamento confirmado' : status === 'pending' ? 'Aguardando confirmação' : 'Falha no pagamento'}
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">{message}</p>

        {paymentInfo ? (
          <div className="mt-6 grid gap-4 rounded-[28px] bg-slate-50 p-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Sessão</p>
              <p className="font-semibold text-slate-900">{paymentInfo.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Valor</p>
              <p className="font-semibold text-slate-900">
                {typeof paymentInfo.amount_total === 'number' ? formatCurrency(paymentInfo.amount_total / 100) : 'N/D'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Status do pedido</p>
              <p className="font-semibold text-slate-900">{status === 'success' ? 'Registrado no painel' : paymentInfo.payment_status}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/admin" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Ver painel de pedidos
          </Link>
          <Link to="/catalogo" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900">
            Voltar ao catálogo
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Pedidos registrados: {orderCount}. Você será redirecionado para a Home em alguns segundos.
        </p>
      </section>
    </div>
  );
}
