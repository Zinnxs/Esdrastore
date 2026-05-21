import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function Admin() {
  const orders = useStore((state) => state.orders);
  const readyOrders = orders.filter((order) => order.status === 'Pago');

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
          <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">ID do pedido</th>
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Pagamento</th>
                  <th className="px-4 py-4">Valor total</th>
                  <th className="px-4 py-4">Itens comprados</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {readyOrders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="px-4 py-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <p className="font-semibold text-slate-900">{order.customer.name}</p>
                      <p className="text-sm">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {order.paymentMethod || 'Stripe Checkout'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={item.cartId}>
                            <span className="font-semibold text-slate-900">{item.name}</span>{' '}
                            <span>
                              x{item.quantity} • {item.size} • {item.color}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
