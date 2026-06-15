'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { initializeAuth } from './slices/authSlice';
import { loadCart } from './slices/cartSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Dispatch initial actions to load local storage and check session
    storeRef.current.dispatch(initializeAuth());
    storeRef.current.dispatch(loadCart());
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
