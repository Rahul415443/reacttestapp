import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createProduct, fetchProducts } from '@/features/products/productsSlice';
import { addToCart } from '@/features/cart/cartSlice';

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  const [showSellForm, setShowSellForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  function handleSell(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    dispatch(
      createProduct({
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        sellerId: user.id,
        sellerName: user.name,
      })
    );
    setTitle('');
    setDescription('');
    setPrice('');
    setStock('');
    setShowSellForm(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <button onClick={() => setShowSellForm((v) => !v)}>
          {showSellForm ? 'Cancel' : '+ Sell a product'}
        </button>
      </div>

      {showSellForm && (
        <form className="sell-form" onSubmit={handleSell}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <button type="submit">List product</button>
        </form>
      )}

      {status === 'loading' && <p>Loading products…</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="product-grid">
        {items.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/products/${product.id}`} className="product-card-title">
              {product.title}
            </Link>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-stock">{product.stock} in stock</p>
            <p className="product-seller">Sold by {product.sellerName}</p>
            <button
              disabled={product.stock === 0}
              onClick={() => dispatch(addToCart({ product }))}
            >
              {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
