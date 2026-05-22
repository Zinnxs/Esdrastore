import { useStore } from '../store/useStore';
import { OrdersBoard } from '../components/OrdersBoard';

export function Pedidos() {
  const role = useStore((state) => state.session.role);

  return <OrdersBoard mode={role === 'admin' ? 'admin' : 'customer'} />;
}
