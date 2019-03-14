import { takeLatest, all } from 'redux-saga/effects';
import API from '../Services/Api';
import FixtureAPI from '../Services/FixtureApi';
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux';
import { ConnectionsTypes } from '../Redux/ConnectionsRedux';

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas';
import { getConnections } from './ConnectionsSagas';

/* ------------- API ------------- */

import * as ConnectionStorageAPI from '../Services/ConnectionStorage';
import { connectionsManager } from '../Services/MQTT';

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(
      [StartupTypes.STARTUP, ConnectionsTypes.CONNECTIONS_REQUEST],
      getConnections,
      ConnectionStorageAPI,
      connectionsManager
    )

    // some sagas receive extra parameters in addition to an action
    // takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
  ]);
}
