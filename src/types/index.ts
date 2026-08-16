// ---- Auth ----
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ---- Products ----
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// ---- Cart ----
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// ---- Orders ----
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrdersState {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
