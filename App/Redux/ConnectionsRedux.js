import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  connectionsRequest: null,
  connectionsSuccess: ['payload'],
  connectionsFailure: null
});

export const ConnectionsTypes = Types;
export default Creators;
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  saving: null,
  connections: null
});

/* ------------- Selectors ------------- */

export const ConnectionsSelectors = {
  getConnections: state => {
    return state.connections.connections;
  }
};

/* ------------- Reducers ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONNECTIONS_REQUEST]: (state, { data }) =>
    state.merge({
      fetching: true,
      connections: null
    }),

  [Types.CONNECTIONS_SUCCESS]: (state, action) => {
    const { payload } = action;
    return state.merge({
      fetching: false,
      error: null,
      connections: payload
    });
  },

  [Types.CONNECTIONS_FAILURE]: state =>
    state.merge({
      fetching: false,
      error: true,
      connections: null
    })
});
