import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOrders } from '@/features/orders/ordersSlice';

export default function Orders() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchOrders(user.id));
  }, [dispatch, user]);

  return (
    <div className="page">
      <h1>Your orders</h1>
      {status === 'loading' && <p>Loading…</p>}
      {error && <p className="form-error">{error}</p>}
      {items.length === 0 && status !== 'loading' && <p>No orders yet.</p>}

      <div className="order-list">
        {items.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span className={`order-status order-status-${order.status}`}>{order.status}</span>
            </div>
            <ul>
              {order.items.map((i) => (
                <li key={i.productId}>
                  {i.title} × {i.quantity} — ${(i.price * i.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="order-total">Total: ${order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
