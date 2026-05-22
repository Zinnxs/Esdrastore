import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function StripeSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderCount = useStore((state) => state.orders.length);
  const createOrder = useStore((state) => state.createOrder);
  const clearCart = useStore((state) => state.clearCart);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);

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

          const createdOrder = createOrder({
            customer: storedCustomer,
            paymentMethod: 'Stripe Checkout',
            total: amount,
            items: storedItems,
            paymentSessionId: sessionId,
          });
          setOrderSummary({
            ...createdOrder,
            customer: storedCustomer,
            items: storedItems,
            total: amount,
            paymentStatus: data.payment_status,
            amountTotal: amount,
          });
          clearCart();
          sessionStorage.removeItem('esdras_stripe_checkout');
        } else {
          setOrderSummary(existingOrder);
        }

        setStatus('success');
        setMessage('Pagamento aprovado. Seu pedido foi registrado com sucesso.');
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
  }, [clearCart, createOrder, sessionId]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Stripe Checkout</p>
        <h1 className="mt-3 text-3xl font-black text-[#f8f1e3] sm:text-5xl">
          {status === 'success' ? 'Pagamento confirmado' : status === 'pending' ? 'Aguardando confirmação' : 'Falha no pagamento'}
        </h1>

        <p className="mt-4 text-base leading-7 text-[#d8c8aa]">{message}</p>

        {orderSummary ? (
          <div className="mt-6 space-y-6 rounded-[28px] border border-white/10 bg-[#0b1020] p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Pedido" value={orderSummary.id} />
              <SummaryCard label="Cliente" value={orderSummary.customer?.name || 'N/D'} />
              <SummaryCard label="E-mail" value={orderSummary.customer?.email || 'N/D'} />
              <SummaryCard label="Pagamento" value={paymentInfo?.payment_status || orderSummary.paymentStatus || 'N/D'} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-[24px] border border-white/10 bg-[#111827] p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">Dados do cliente</p>
                <div className="mt-3 space-y-2 text-sm text-[#d8c8aa]">
                  <p><span className="font-semibold text-[#f8f1e3]">Nome:</span> {orderSummary.customer?.name || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">E-mail:</span> {orderSummary.customer?.email || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">CPF:</span> {orderSummary.customer?.cpf || 'N/D'}</p>
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-[#111827] p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">Endereço de entrega</p>
                <div className="mt-3 space-y-2 text-sm text-[#d8c8aa]">
                  <p><span className="font-semibold text-[#f8f1e3]">Rua:</span> {orderSummary.customer?.address?.street || 'N/D'}, {orderSummary.customer?.address?.number || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">Complemento:</span> {orderSummary.customer?.address?.complement || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">Bairro:</span> {orderSummary.customer?.address?.neighborhood || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">Cidade/UF:</span> {orderSummary.customer?.address?.city || 'N/D'} / {orderSummary.customer?.address?.state || 'N/D'}</p>
                  <p><span className="font-semibold text-[#f8f1e3]">CEP:</span> {orderSummary.customer?.address?.zip || 'N/D'}</p>
                </div>
              </section>
            </div>

            <section className="rounded-[24px] border border-white/10 bg-[#111827] p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">Itens do pedido</p>
              <div className="mt-4 space-y-3">
                {orderSummary.items?.map((item) => (
                  <div key={item.cartId} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b1020] p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div>
                        <p className="font-semibold text-[#f8f1e3]">{item.name}</p>
                        <p className="text-sm text-[#d8c8aa]">Tamanho {item.size} • Cor {item.color}</p>
                        <p className="text-sm text-[#d8c8aa]">Qtd: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-[#d8c8aa]">
                      <p className="font-semibold text-[#f8f1e3]">{formatCurrency(item.price * item.quantity)}</p>
                      <p>Preço unitário: {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard label="Sessão Stripe" value={paymentInfo?.id || 'N/D'} />
              <SummaryCard label="Total" value={formatCurrency(orderSummary.total || 0)} />
              <SummaryCard label="Status" value={status === 'success' ? 'Registrado no painel' : 'Pendente'} />
            </div>
          </div>
        ) : paymentInfo ? (
          <div className="mt-6 grid gap-4 rounded-[28px] border border-white/10 bg-[#0b1020] p-5 sm:grid-cols-3">
            <SummaryCard label="Sessão" value={paymentInfo.id} />
            <SummaryCard label="Valor" value={typeof paymentInfo.amount_total === 'number' ? formatCurrency(paymentInfo.amount_total / 100) : 'N/D'} />
            <SummaryCard label="Status do pedido" value={status === 'success' ? 'Registrado no painel' : paymentInfo.payment_status} />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/admin" className="inline-flex items-center justify-center rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]">
            Ver painel de pedidos
          </Link>
          <Link to="/catalogo" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#171717] px-6 py-3 text-sm font-semibold text-[#f8f1e3]">
            Voltar ao catálogo
          </Link>
        </div>

        <p className="mt-6 text-sm text-[#d8c8aa]">Pedidos registrados: {orderCount}.</p>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-[#f8f1e3]">{value}</p>
    </div>
  );
}
