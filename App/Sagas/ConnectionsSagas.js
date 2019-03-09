import { call, put } from 'redux-saga/effects';
import ConnectionsRedux from '../Redux/ConnectionsRedux';

export function* getConnections(api, connectionsManager, action) {
  try {
    const response = yield call(api.loadConnections);
    yield put(ConnectionsRedux.connectionsSuccess(response));
    connectionsManager.resetConnections(response);
  } catch (e) {
    yield put(ConnectionsRedux.connectionsFailure());
  }
}
