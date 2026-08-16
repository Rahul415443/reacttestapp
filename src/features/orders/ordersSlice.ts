import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetchOrders, apiPlaceOrder } from '@/api/client';
import type { OrderItem, OrdersState } from '@/types';

const initialState: OrdersState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (buyerId: string, { rejectWithValue }) => {
    try {
      return await apiFetchOrders(buyerId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/place',
  async ({ buyerId, items }: { buyerId: string; items: OrderItem[] }, { rejectWithValue }) => {
    try {
      return await apiPlaceOrder(buyerId, items);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load orders';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default ordersSlice.reducer;
