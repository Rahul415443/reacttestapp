import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearCart, removeFromCart, updateQuantity } from '@/features/cart/cartSlice';
import { placeOrder } from '@/features/orders/ordersSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  async function handleCheckout() {
    if (!user || items.length === 0) return;
    const orderItems = items.map((i) => ({
      productId: i.product.id,
      title: i.product.title,
      price: i.product.price,
      quantity: i.quantity,
    }));
    const result = await dispatch(placeOrder({ buyerId: user.id, items: orderItems }));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate('/orders');
    }
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.product.id} className="cart-row">
            <span className="cart-title">{item.product.title}</span>
            <input
              type="number"
              min={1}
              max={item.product.stock}
              value={item.quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({ productId: item.product.id, quantity: Number(e.target.value) })
                )
              }
            />
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => dispatch(removeFromCart({ productId: item.product.id }))}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Place order
      </button>
    </div>
  );
}
