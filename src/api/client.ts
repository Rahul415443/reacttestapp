// Lightweight mock backend so the app is runnable out of the box.
// Replace the bodies of these functions with real `fetch` calls to your
// backend when it's ready — the function signatures are designed to make
// that swap a drop-in change for the Redux thunks that call them.

import type {
  LoginPayload,
  RegisterPayload,
  User,
  Product,
  Order,
  OrderItem,
} from '@/types';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- in-memory "database" ----
let users: (User & { password: string })[] = [
  { id: 'u1', name: 'Demo Seller', email: 'seller@example.com', password: 'password123' },
];

let products: Product[] = [
  {
    id: 'p1',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30h battery life.',
    price: 89.99,
    stock: 15,
    sellerId: 'u1',
    sellerName: 'Demo Seller',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Mechanical Keyboard',
    description: 'Hot-swappable 75% mechanical keyboard with tactile switches.',
    price: 129.0,
    stock: 8,
    sellerId: 'u1',
    sellerName: 'Demo Seller',
    createdAt: new Date().toISOString(),
  },
];

let orders: Order[] = [];

const makeId = () => Math.random().toString(36).slice(2, 10);

// ---- Auth ----
export async function apiLogin(payload: LoginPayload): Promise<{ user: User; token: string }> {
  await delay();
  const found = users.find((u) => u.email === payload.email && u.password === payload.password);
  if (!found) throw new Error('Invalid email or password');
  const { password, ...user } = found;
  return { user, token: `mock-token-${user.id}` };
}

export async function apiRegister(payload: RegisterPayload): Promise<{ user: User; token: string }> {
  await delay();
  if (users.some((u) => u.email === payload.email)) {
    throw new Error('An account with this email already exists');
  }
  const newUser = { id: makeId(), name: payload.name, email: payload.email, password: payload.password };
  users.push(newUser);
  const { password, ...user } = newUser;
  return { user, token: `mock-token-${user.id}` };
}

// ---- Products ----
export async function apiFetchProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function apiCreateProduct(
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> {
  await delay();
  const product: Product = { ...data, id: makeId(), createdAt: new Date().toISOString() };
  products = [product, ...products];
  return product;
}

// ---- Orders ----
export async function apiPlaceOrder(buyerId: string, items: OrderItem[]): Promise<Order> {
  await delay();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order: Order = {
    id: makeId(),
    buyerId,
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders = [order, ...orders];

  // decrement stock for sold items
  products = products.map((p) => {
    const sold = items.find((i) => i.productId === p.id);
    return sold ? { ...p, stock: Math.max(0, p.stock - sold.quantity) } : p;
  });

  return order;
}

export async function apiFetchOrders(buyerId: string): Promise<Order[]> {
  await delay();
  return orders.filter((o) => o.buyerId === buyerId);
}
