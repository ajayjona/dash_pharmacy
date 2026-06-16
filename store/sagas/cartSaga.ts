import { takeLatest, select, call, put, debounce } from 'redux-saga/effects';
import { loadCart, setCart, addItem, removeItem, updateQuantity, clearCart, CartItem } from '../slices/cartSlice';
import { RootState } from '../rootReducer';
import { loginSuccess, logoutSuccess } from '../slices/authSlice';

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

const fetchRemoteCart = async () => {
  const res = await fetch('/api/cart');
  if (res.ok) {
    const data = await res.json();
    return data.items || [];
  }
  return [];
};

const putRemoteCart = async (items: CartItem[]) => {
  const payload = items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }));
  const res = await fetch('/api/cart', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: payload })
  });
  if (res.ok) {
    const data = await res.json();
    return data.items || [];
  }
  return items;
};

const mergeCarts = (local: CartItem[], remote: CartItem[]): CartItem[] => {
  const map = new Map<string, CartItem>();
  for (const item of remote) {
    map.set(item.product.id, item);
  }
  for (const item of local) {
    if (map.has(item.product.id)) {
      const existing = map.get(item.product.id)!;
      existing.quantity = Math.max(existing.quantity, item.quantity);
    } else {
      map.set(item.product.id, item);
    }
  }
  return Array.from(map.values());
};

function* handleLoadCart(): Generator<any, void, any> {
  const localItems = yield call(getLocalStorageCart);
  
  try {
    const remoteItems = yield call(fetchRemoteCart);
    const isAuthenticated: boolean = yield select((state: RootState) => state.auth.isAuthenticated);
    
    let finalItems = localItems;
    
    if (remoteItems && remoteItems.length > 0) {
      finalItems = mergeCarts(localItems, remoteItems);
    }

    yield put(setCart(finalItems));
    yield call(setLocalStorageCart, finalItems);
    
    // Attempt to put merged cart if we know user is authenticated, 
    // or if the remoteItems existed (meaning the endpoint returned items, so user is logged in).
    if (isAuthenticated || (remoteItems && remoteItems.length > 0)) {
        yield call(putRemoteCart, finalItems);
    }
  } catch (e) {
    yield put(setCart(localItems));
  }
}

function* syncCartToStorage(): Generator<any, void, any> {
  const items: CartItem[] = yield select((state: RootState) => state.cart.items);
  const isAuthenticated: boolean = yield select((state: RootState) => state.auth.isAuthenticated);
  
  yield call(setLocalStorageCart, items);
  
  if (isAuthenticated) {
    try {
      yield call(putRemoteCart, items);
    } catch (e) {
      console.error('Failed to sync cart to server', e);
    }
  }
}

function* handleLoginSuccess(): Generator<any, void, any> {
  const localItems = yield call(getLocalStorageCart);
  try {
    const remoteItems = yield call(fetchRemoteCart);
    const finalItems = mergeCarts(localItems, remoteItems);
    
    yield put(setCart(finalItems));
    yield call(setLocalStorageCart, finalItems);
    yield call(putRemoteCart, finalItems);
  } catch (e) {
    console.error('Failed to merge cart on login', e);
  }
}

function* handleLogoutSuccess(): Generator<any, void, any> {
  yield call(setLocalStorageCart, []);
  yield put(clearCart());
}

export default function* cartSaga() {
  yield takeLatest(loadCart.type, handleLoadCart);
  yield debounce(500, [addItem.type, removeItem.type, updateQuantity.type, clearCart.type], syncCartToStorage);
  yield takeLatest(loginSuccess.type, handleLoginSuccess);
  yield takeLatest(logoutSuccess.type, handleLogoutSuccess);
}
