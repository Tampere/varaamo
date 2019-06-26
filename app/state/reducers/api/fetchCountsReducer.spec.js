import types from 'constants/ActionTypes';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';

import fetchCountsReducer from './fetchCountsReducer';

describe('state/reducers/api/fetchCountsReducer', () => {
  describe('initial state', () => {
    const initialState = fetchCountsReducer(undefined, {});

    test('reservations is 0', () => {
      expect(initialState.reservations).toBe(0);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATIONS_GET_SUCCESS', () => {
      const getReservationsSuccess = createAction(types.API.RESERVATIONS_GET_SUCCESS);

      test('increases reservations by 1', () => {
        const action = getReservationsSuccess();
        const initialState = Immutable({
          reservations: 3,
        });
        const nextState = fetchCountsReducer(initialState, action);

        expect(nextState.reservations).toBe(4);
      });
    });
  });
});
