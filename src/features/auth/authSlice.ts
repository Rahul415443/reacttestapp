import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiLogin, apiRegister } from '@/api/client';
import type { AuthState, LoginPayload, RegisterPayload, User } from '@/types';

const persistedUser = localStorage.getItem('auth_user');
const persistedToken = localStorage.getItem('auth_token');

const initialState: AuthState = {
  user: persistedUser ? (JSON.parse(persistedUser) as User) : null,
  token: persistedToken,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await apiLogin(payload);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await apiRegister(payload);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action): action is PayloadAction<undefined, string> =>
          action.type === login.pending.type || action.type === register.pending.type,
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<{ user: User; token: string }> =>
          action.type === login.fulfilled.type || action.type === register.fulfilled.type,
        (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
          localStorage.setItem('auth_token', action.payload.token);
        }
      )
      .addMatcher(
        (action): action is PayloadAction<string> =>
          action.type === login.rejected.type || action.type === register.rejected.type,
        (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as string) ?? 'Something went wrong';
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
