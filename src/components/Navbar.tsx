import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/products" className="navbar-brand">
        Buy & Sell
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/orders">Orders</Link>
            <span className="navbar-user">Hi, {user.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
