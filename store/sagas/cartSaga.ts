import { takeLatest, select, call, put } from 'redux-saga/effects';
import { loadCart, setCart, addItem, removeItem, updateQuantity, clearCart, CartItem } from '../slices/cartSlice';
import { RootState } from '../rootReducer';

const CART_KEY = 'dashcare_cart';

const getLocalStorageCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalStorageCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
};

function* handleLoadCart(): Generator<any, void, any> {
  const items = yield call(getLocalStorageCart);
  yield put(setCart(items));
}

function* syncCartToStorage(): Generator<any, void, any> {
  const items: CartItem[] = yield select((state: RootState) => state.cart.items);
  yield call(setLocalStorageCart, items);
}

export default function* cartSaga() {
  yield takeLatest(loadCart.type, handleLoadCart);
  yield takeLatest([addItem.type, removeItem.type, updateQuantity.type, clearCart.type], syncCartToStorage);
}
