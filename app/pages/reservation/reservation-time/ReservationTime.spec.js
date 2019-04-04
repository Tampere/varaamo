import React from 'react';
import simple from 'simple-mock';
import moment from 'moment';

import ReservationCalendar from 'pages/resource/reservation-calendar';
import ResourceCalendar from 'shared/resource-calendar';
import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationTime from './ReservationTime';

describe('pages/reservation/reservation-time/ReservationTime', () => {
  const history = {
    replace: () => {},
  };

  const defaultProps = {
    history,
    location: {},
    onCancel: simple.mock(),
    onConfirm: simple.mock(),
    match: { params: {} },
    resource: Resource.build(),
    selectedReservation: Reservation.build(),
    unit: Unit.build(),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationTime {...defaultProps} {...extraProps} />);
  }

  test('renders ResourceCalendar', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const resourceCalendar = wrapper.find(ResourceCalendar);
    const date = moment(defaultProps.selectedReservation.begin).format('YYYY-MM-DD');

    expect(resourceCalendar).toHaveLength(1);
    expect(resourceCalendar.prop('onDateChange')).toBe(instance.handleDateChange);
    expect(resourceCalendar.prop('selectedDate')).toBe(date);
  });

  test('renders ReservationCalendar', () => {
    const location = { query: { q: 1 } };
    const reservationCalendar = getWrapper({ location }).find(ReservationCalendar);

    expect(reservationCalendar).toHaveLength(1);
    expect(reservationCalendar.prop('location')).toEqual(location);
    expect(reservationCalendar.prop('params')).toEqual({ id: defaultProps.resource.id });
  });

  test('renders resource and unit names', () => {
    const details = getWrapper().find('.app-ReservationDetails__value');

    expect(details).toHaveLength(1);
    expect(details.props().children).toEqual(expect.arrayContaining([defaultProps.resource.name]));
    expect(details.props().children).toEqual(expect.arrayContaining([defaultProps.unit.name]));
  });

  describe('handleDateChange', () => {
    const date = new Date();
    const day = date.toISOString().substring(0, 10);
    const expectedPath = `/reservation?date=${day}&resource=${defaultProps.resource.id}`;
    let instance;
    let historyMock;

    beforeAll(() => {
      instance = getWrapper().instance();
      historyMock = simple.mock(history, 'replace');
      instance.handleDateChange(date);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history replace with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
