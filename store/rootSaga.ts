import { all, fork } from 'redux-saga/effects';
import cartSaga from './sagas/cartSaga';
import authSaga from './sagas/authSaga';

export function* rootSaga() {
  yield all([
    fork(cartSaga),
    fork(authSaga),
  ]);
}
