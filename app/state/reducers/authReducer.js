import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';


const initialState = Immutable({
  token: null,
  userId: null,
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.AUTH_GET_SUCCESS: {
      return { ...initialState, ...action.payload.auth };
    }

    case types.API.RESERVATION_DELETE_ERROR:
    case types.API.RESERVATION_PUT_ERROR:
    case types.API.RESERVATION_POST_ERROR: {
      if (action.payload.status === 401) {
        return initialState;
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default authReducer;
