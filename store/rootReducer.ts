import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
