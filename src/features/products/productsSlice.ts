import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiCreateProduct, apiFetchProducts } from '@/api/client';
import type { Product, ProductsState } from '@/types';

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      return await apiFetchProducts();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (data: Omit<Product, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      return await apiCreateProduct(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default productsSlice.reducer;
