import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    loadCart: (state) => {
      // Handled by saga
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce((acc, item) => acc + item.quantity, 0);
      state.total = action.payload.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    },
    addItem: (state, action: PayloadAction<{ product: Product, quantity?: number } | Product>) => {
      const payload = 'product' in action.payload ? action.payload : { product: action.payload, quantity: 1 };
      const { product, quantity = 1 } = payload;
      
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      state.itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.total = state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
      state.itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.total = state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const existing = state.items.find(i => i.product.id === action.payload.id);
      if (existing) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.product.id !== action.payload.id);
        } else {
          existing.quantity = action.payload.quantity;
        }
      }
      state.itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.total = state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
    }
  },
});

export const { openCart, closeCart, loadCart, setCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
