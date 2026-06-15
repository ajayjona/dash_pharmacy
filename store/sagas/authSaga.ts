import { call, put, takeLatest } from 'redux-saga/effects';
import { initializeAuth, loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess } from '../slices/authSlice';
import { signIn, signOut } from 'next-auth/react';

// Fetch session from API
const fetchSession = async () => {
  const res = await fetch('/api/auth/session');
  return res.json();
};

function* handleInitializeAuth(): Generator<any, void, any> {
  try {
    const session = yield call(fetchSession);
    if (session?.user) {
      yield put(loginSuccess(session.user));
    } else {
      yield put(loginFailure('Not authenticated'));
    }
  } catch (error) {
    yield put(loginFailure('Failed to fetch session'));
  }
}

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator<any, void, any> {
  try {
    const { email, password, callbackUrl } = action.payload;
    const res = yield call(signIn, 'credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      yield put(loginFailure(res.error));
    } else {
      // Re-fetch session
      const session = yield call(fetchSession);
      if (session?.user) {
        yield put(loginSuccess(session.user));
        if (session.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = callbackUrl || '/';
        }
      } else {
        yield put(loginFailure('Login failed'));
      }
    }
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    yield call(signOut, { redirect: false });
    yield put(logoutSuccess());
    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
}

export default function* authSaga() {
  yield takeLatest(initializeAuth.type, handleInitializeAuth);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}
