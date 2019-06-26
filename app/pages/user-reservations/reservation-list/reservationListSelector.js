import ActionTypes from 'constants/ActionTypes';

import { createStructuredSelector } from 'reselect';

import { isAdminSelector, staffUnitsSelector } from 'state/selectors/authSelectors';
import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'state/selectors/sortedReservationsSelector';

const reservationListSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isFetchingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  reservations: sortedReservationsSelector,
  resources: resourcesSelector,
  staffUnits: staffUnitsSelector,
  units: unitsSelector,
});

export default reservationListSelector;
