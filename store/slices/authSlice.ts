import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  phone?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading to check session
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      state.isLoading = true;
    },
    loginRequest: (state, action: PayloadAction<{ email: string; password: string; callbackUrl?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { initializeAuth, loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
