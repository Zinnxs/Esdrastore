import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function Admin() {
  const orders = useStore((state) => state.orders);
  const readyOrders = orders.filter((order) => order.status === 'Pago');
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Painel administrativo</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Pedidos prontos</h1>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            {readyOrders.length} pedido(s) pago(s) e prontos para separação
          </div>
        </div>

        {readyOrders.length > 0 ? (
          <div className="mt-6 space-y-4">
            {readyOrders.map((order) => (
              <details key={order.id} className="group rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Pedido {order.id}</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">{order.customer.name}</h2>
                    <p className="text-sm text-slate-500">{order.customer.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {order.paymentMethod || 'Stripe Checkout'}
                    </span>
                    <span className="text-lg font-bold text-slate-950">{formatCurrency(order.total)}</span>
                  </div>
                </summary>

                <div className="border-t border-slate-100 px-5 py-5">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <InfoBlock label="Status" value={order.status} />
                    <InfoBlock label="Data do pedido" value={new Date(order.createdAt).toLocaleString('pt-BR')} />
                    <InfoBlock label="Sessão Stripe" value={order.paymentSessionId || 'N/D'} />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Dados do cliente</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p><span className="font-semibold text-slate-900">Nome:</span> {order.customer.name}</p>
                        <p><span className="font-semibold text-slate-900">E-mail:</span> {order.customer.email}</p>
                        <p><span className="font-semibold text-slate-900">CPF:</span> {order.customer.cpf || 'N/D'}</p>
                      </div>
                    </section>

                    <section className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Endereço de entrega</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p><span className="font-semibold text-slate-900">CEP:</span> {order.customer.address?.zip || 'N/D'}</p>
                        <p><span className="font-semibold text-slate-900">Rua:</span> {order.customer.address?.street || 'N/D'}, {order.customer.address?.number || 'N/D'}</p>
                        <p><span className="font-semibold text-slate-900">Complemento:</span> {order.customer.address?.complement || 'N/D'}</p>
                        <p><span className="font-semibold text-slate-900">Bairro:</span> {order.customer.address?.neighborhood || 'N/D'}</p>
                        <p><span className="font-semibold text-slate-900">Cidade/UF:</span> {order.customer.address?.city || 'N/D'} / {order.customer.address?.state || 'N/D'}</p>
                      </div>
                    </section>
                  </div>

                  <section className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Itens comprados</p>
                    <div className="mt-3 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.cartId} className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                            <div>
                              <p className="font-semibold text-slate-950">{item.name}</p>
                              <p className="text-sm text-slate-500">Tamanho {item.size} • Cor {item.color}</p>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">Qtd:</span> {item.quantity} • <span className="font-semibold text-slate-900">Subtotal:</span> {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Ações rápidas</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'Separado')}
                        className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        Marcar como separado
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'Enviado')}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Marcar como enviado
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      Status atual: <span className="font-semibold text-slate-900">{order.status}</span>
                    </p>
                  </section>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-xl font-bold text-slate-900">Nenhum pedido pronto ainda.</p>
            <p className="mt-2 text-slate-500">Finalize uma compra como cliente para exibir o pedido aqui imediatamente.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900 break-all">{value}</p>
    </div>
  );
}
