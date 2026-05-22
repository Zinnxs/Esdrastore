import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

const statusStyles = {
  Pago: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  Separado: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  Enviado: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
};

export function OrdersBoard({ mode = 'customer' }) {
  const session = useStore((state) => state.session);
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  const visibleOrders = useMemo(() => {
    if (mode === 'admin') {
      return orders;
    }

    const email = session.email?.trim().toLowerCase();
    return orders.filter((order) => (order.customerEmail || order.customer?.email || '').trim().toLowerCase() === email);
  }, [mode, orders, session.email]);

  const summary = useMemo(() => {
    const counts = { total: visibleOrders.length, Pago: 0, Separado: 0, Enviado: 0 };

    visibleOrders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status] += 1;
      }
    });

    return counts;
  }, [visibleOrders]);

  const title = mode === 'admin' ? 'Painel de pedidos do admin' : 'Meus pedidos';
  const subtitle = mode === 'admin'
    ? 'Todos os pedidos de todos os clientes, em qualquer situação.'
    : 'Veja apenas os pedidos feitos com seu login e acompanhe o status de cada um.';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl p-6 bg-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Pedidos</p>
            <h1 className="mt-2 text-3xl font-black text-[color:var(--text)] sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 muted">{subtitle}</p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-3 text-sm font-medium text-[color:var(--text)]">
            {mode === 'admin' ? 'Admin vê tudo' : session.email || 'Usuário não identificado'}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total" value={summary.total} />
          <MetricCard label="Pago" value={summary.Pago} />
          <MetricCard label="Separado" value={summary.Separado} />
          <MetricCard label="Enviado" value={summary.Enviado} />
        </div>

        {visibleOrders.length > 0 ? (
          <div className="mt-8 space-y-4">
            {visibleOrders.map((order) => (
              <details key={order.id} className="group rounded-2xl bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] muted">Pedido {order.id}</p>
                    <h2 className="mt-1 text-lg font-bold text-[color:var(--text)]">{order.customer?.name || 'Cliente'}</h2>
                    <p className="text-sm muted">{order.customer?.email || order.customerEmail || 'N/D'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {order.status || 'N/D'}
                    </span>
                    <span className="text-lg font-bold text-[color:var(--text)]">{formatCurrency(order.total)}</span>
                  </div>
                </summary>

                <div className="border-t px-5 py-5">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <InfoBlock label="Pagamento" value={order.paymentMethod || 'Stripe Checkout'} />
                    <InfoBlock label="Data do pedido" value={new Date(order.createdAt).toLocaleString('pt-BR')} />
                    <InfoBlock label="Sessão Stripe" value={order.paymentSessionId || 'N/D'} />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-2xl p-4 bg-white shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] muted">Dados do cliente</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="font-semibold text-[color:var(--text)]">Nome:</span> {order.customer?.name || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">E-mail:</span> {order.customer?.email || order.customerEmail || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">CPF:</span> {order.customer?.cpf || 'N/D'}</p>
                      </div>
                    </section>

                    <section className="rounded-2xl p-4 bg-white shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] muted">Endereço de entrega</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="font-semibold text-[color:var(--text)]">CEP:</span> {order.customer?.address?.zip || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">Rua:</span> {order.customer?.address?.street || 'N/D'}, {order.customer?.address?.number || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">Complemento:</span> {order.customer?.address?.complement || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">Bairro:</span> {order.customer?.address?.neighborhood || 'N/D'}</p>
                        <p><span className="font-semibold text-[color:var(--text)]">Cidade/UF:</span> {order.customer?.address?.city || 'N/D'} / {order.customer?.address?.state || 'N/D'}</p>
                      </div>
                    </section>
                  </div>

                  <section className="mt-5 p-4 bg-white rounded-2xl shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] muted">Itens comprados</p>
                    <div className="mt-3 space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.cartId} className="flex flex-col gap-3 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                            <div>
                              <p className="font-semibold text-[color:var(--text)]">{item.name}</p>
                              <p className="text-sm muted">Tamanho {item.size} • Cor {item.color}</p>
                            </div>
                          </div>
                          <div className="text-sm muted">
                            <span className="font-semibold text-[color:var(--text)]">Qtd:</span> {item.quantity} • <span className="font-semibold text-[color:var(--text)]">Subtotal:</span> {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {mode === 'admin' ? (
                    <section className="mt-5 p-4 bg-white rounded-2xl shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] muted">Ações rápidas</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => updateOrderStatus(order.id, 'Separado')} className="btn-ghost">Marcar como separado</button>
                        <button type="button" onClick={() => updateOrderStatus(order.id, 'Enviado')} className="btn-primary">Marcar como enviado</button>
                      </div>
                      <p className="mt-3 text-sm muted">Situação atual: <span className="font-semibold text-[color:var(--text)]">{order.status}</span></p>
                    </section>
                  ) : (
                    <section className="mt-5 p-4 bg-white rounded-2xl shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] muted">Situação do pedido</p>
                      <p className="mt-2 text-base font-semibold text-[color:var(--text)]">{order.status}</p>
                    </section>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-6 p-10 text-center bg-white rounded-2xl shadow-sm">
            <p className="text-xl font-bold text-[color:var(--text)]">Nenhum pedido disponível ainda.</p>
            <p className="mt-2 muted">{mode === 'admin' ? 'Finalize uma compra para ver todos os pedidos aqui.' : 'Faça um pedido para vê-lo neste painel.'}</p>
            {mode !== 'admin' ? (
              <Link to="/catalogo" className="mt-6 btn-primary inline-flex">Ir para o catálogo</Link>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-[#403a33] bg-[#111827] p-4 text-[#f2e7d5]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#f8f1e3]">{value}</p>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold text-[#111827]">{value}</p>
    </div>
  );
}
