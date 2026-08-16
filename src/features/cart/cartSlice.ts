import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartState, Product } from '@/types';

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload.productId);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
