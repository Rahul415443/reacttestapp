import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProducts } from '@/features/products/productsSlice';
import { addToCart } from '@/features/cart/cartSlice';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  const product = items.find((p) => p.id === id);

  if (status === 'loading') return <p className="page">Loading…</p>;
  if (!product) {
    return (
      <div className="page">
        <p>Product not found.</p>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/products" className="back-link">
        ← Back to products
      </Link>
      <div className="product-detail">
        <h1>{product.title}</h1>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p className="product-stock">{product.stock} in stock</p>
        <p className="product-seller">Sold by {product.sellerName}</p>
        <button disabled={product.stock === 0} onClick={() => dispatch(addToCart({ product }))}>
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
