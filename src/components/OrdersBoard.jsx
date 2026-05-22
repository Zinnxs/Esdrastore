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
      <section className="rounded-[36px] border border-[#3f3a33] bg-[#0f172a] p-6 text-[#f2e7d5] shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Pedidos</p>
            <h1 className="mt-2 text-3xl font-black text-[#f8f1e3] sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#d8c8aa]">{subtitle}</p>
          </div>
          <div className="rounded-3xl border border-[#5c5346] bg-[#171717] px-4 py-3 text-sm font-medium text-[#f2e7d5]">
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
              <details key={order.id} className="group rounded-[28px] border border-[#403a33] bg-[#171717] shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6ad7e]">Pedido {order.id}</p>
                    <h2 className="mt-1 text-lg font-bold text-[#f8f1e3]">{order.customer?.name || 'Cliente'}</h2>
                    <p className="text-sm text-[#d8c8aa]">{order.customer?.email || order.customerEmail || 'N/D'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[order.status] || 'bg-slate-500/15 text-slate-100 border-slate-400/30'}`}>
                      {order.status || 'N/D'}
                    </span>
                    <span className="text-lg font-bold text-[#f8f1e3]">{formatCurrency(order.total)}</span>
                  </div>
                </summary>

                <div className="border-t border-[#403a33] px-5 py-5">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <InfoBlock label="Pagamento" value={order.paymentMethod || 'Stripe Checkout'} />
                    <InfoBlock label="Data do pedido" value={new Date(order.createdAt).toLocaleString('pt-BR')} />
                    <InfoBlock label="Sessão Stripe" value={order.paymentSessionId || 'N/D'} />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">Dados do cliente</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="font-semibold text-[#111827]">Nome:</span> {order.customer?.name || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">E-mail:</span> {order.customer?.email || order.customerEmail || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">CPF:</span> {order.customer?.cpf || 'N/D'}</p>
                      </div>
                    </section>

                    <section className="rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">Endereço de entrega</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="font-semibold text-[#111827]">CEP:</span> {order.customer?.address?.zip || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">Rua:</span> {order.customer?.address?.street || 'N/D'}, {order.customer?.address?.number || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">Complemento:</span> {order.customer?.address?.complement || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">Bairro:</span> {order.customer?.address?.neighborhood || 'N/D'}</p>
                        <p><span className="font-semibold text-[#111827]">Cidade/UF:</span> {order.customer?.address?.city || 'N/D'} / {order.customer?.address?.state || 'N/D'}</p>
                      </div>
                    </section>
                  </div>

                  <section className="mt-5 rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">Itens comprados</p>
                    <div className="mt-3 space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.cartId} className="flex flex-col gap-3 rounded-2xl bg-[#fffaf0] p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                            <div>
                              <p className="font-semibold text-[#111827]">{item.name}</p>
                              <p className="text-sm text-[#665447]">Tamanho {item.size} • Cor {item.color}</p>
                            </div>
                          </div>
                          <div className="text-sm text-[#4b5563]">
                            <span className="font-semibold text-[#111827]">Qtd:</span> {item.quantity} • <span className="font-semibold text-[#111827]">Subtotal:</span> {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {mode === 'admin' ? (
                    <section className="mt-5 rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">Ações rápidas</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Separado')}
                          className="inline-flex items-center justify-center rounded-full bg-[#1f2937] px-4 py-2 text-sm font-semibold text-[#f8f1e3] transition hover:bg-black"
                        >
                          Marcar como separado
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Enviado')}
                          className="inline-flex items-center justify-center rounded-full bg-[#8a6f42] px-4 py-2 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#6f5632]"
                        >
                          Marcar como enviado
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-[#665447]">
                        Situação atual: <span className="font-semibold text-[#111827]">{order.status}</span>
                      </p>
                    </section>
                  ) : (
                    <section className="mt-5 rounded-3xl bg-[#f2e7d5] p-4 text-[#111827]">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8a6f42]">Situação do pedido</p>
                      <p className="mt-2 text-base font-semibold text-[#111827]">{order.status}</p>
                    </section>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-[#5c5346] bg-[#171717] p-10 text-center text-[#f2e7d5]">
            <p className="text-xl font-bold text-[#f8f1e3]">Nenhum pedido disponível ainda.</p>
            <p className="mt-2 text-[#d8c8aa]">
              {mode === 'admin' ? 'Finalize uma compra para ver todos os pedidos aqui.' : 'Faça um pedido para vê-lo neste painel.'}
            </p>
            {mode !== 'admin' ? (
              <Link to="/catalogo" className="mt-6 inline-flex rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]">
                Ir para o catálogo
              </Link>
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
