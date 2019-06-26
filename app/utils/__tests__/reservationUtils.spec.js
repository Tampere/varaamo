import constants from 'constants/AppConstants';

import MockDate from 'mockdate';
import moment from 'moment';

import Reservation from 'utils/fixtures/Reservation';
import {
  combine,
  isStaffEvent,
  getCurrentReservation,
  getMissingValues,
  getNextAvailableTime,
  getNextReservation,
} from 'utils/reservationUtils';

describe('Utils: reservationUtils', () => {
  describe('combine', () => {
    const slots = [
      {
        begin: '2015-10-16T08:00:00.000Z',
        end: '2015-10-16T09:00:00.000Z',
      },
      {
        begin: '2015-10-16T09:00:00.000Z',
        end: '2015-10-16T10:00:00.000Z',
      },
      {
        begin: '2015-10-16T10:00:00.000Z',
        end: '2015-10-16T11:00:00.000Z',
      },
      {
        begin: '2015-10-16T11:00:00.000Z',
        end: '2015-10-16T12:00:00.000Z',
      },
    ];

    test('returns an empty array if reservations is undefined', () => {
      const reservations = undefined;

      expect(combine(reservations)).toEqual([]);
    });

    test('returns an empty array if reservations is empty', () => {
      const reservations = [];

      expect(combine(reservations)).toEqual([]);
    });

    test(
      'returns the reservations unchanged if it contains only one element',
      () => {
        const reservations = ['mock reservation'];

        expect(combine(reservations)).toEqual(reservations);
      }
    );

    test('combines two reservations if they are continual', () => {
      const reservations = [slots[0], slots[1]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[1].end,
      }];

      expect(combine(reservations)).toEqual(expected);
    });

    test('does not combine two reservations if they are not continual', () => {
      const reservations = [slots[0], slots[2]];

      expect(combine(reservations)).toEqual(reservations);
    });

    test('combines three reservations if they are continual', () => {
      const reservations = [slots[0], slots[1], slots[2]];
      const expected = [{
        begin: slots[0].begin,
        end: slots[2].end,
      }];

      expect(combine(reservations)).toEqual(expected);
    });

    test('only combines reservations that are continual', () => {
      const reservations = [slots[0], slots[1], slots[3]];
      const expected = [
        {
          begin: slots[0].begin,
          end: slots[1].end,
        },
        slots[3],
      ];

      expect(combine(reservations)).toEqual(expected);
    });
  });

  describe('isStaffEvent', () => {
    test('returns false if resource does not exist', () => {
      const reservation = { reserverName: 'Luke' };
      const resource = undefined;
      expect(isStaffEvent(reservation, resource)).toBe(false);
    });

    test(
      'returns false if resource does not have any requiredReservationExtraFields',
      () => {
        const reservation = { reserverName: 'Luke' };
        const resource = {};
        expect(isStaffEvent(reservation, resource)).toBe(false);
      }
    );

    test(
      'returns false if reservation has values for requiredReservationExtraFields',
      () => {
        const reservation = { reserverName: 'Luke' };
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).toBe(false);
      }
    );

    test(
      'returns true if reservation is missing values for requiredReservationExtraFields',
      () => {
        const reservation = {};
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).toBe(true);
      }
    );

    test(
      'returns true if reservation has empty strings for requiredReservationExtraFields',
      () => {
        const reservation = { reserverName: '' };
        const resource = { requiredReservationExtraFields: ['reserver_name'] };
        expect(isStaffEvent(reservation, resource)).toBe(true);
      }
    );
  });

  describe('getCurrentReservation', () => {
    const previousReservation = Reservation.build({}, { startTime: moment().subtract(1, 'days') });
    const currentReservation = Reservation.build(
      {},
      { startTime: moment().subtract(20, 'minutes') }
    );
    const nextReservation = Reservation.build({}, { startTime: moment().add(2, 'hours') });
    const lastReservation = Reservation.build({}, { startTime: moment().add(4, 'hours') });
    const unorderedReservations = [
      lastReservation,
      previousReservation,
      nextReservation,
      currentReservation,
    ];

    test('returns the current reservation from a list of reservations', () => {
      expect(getCurrentReservation(unorderedReservations)).toEqual(currentReservation);
    });
  });

  describe('getMissingValues', () => {
    function getReservation(extraValues) {
      const defaults = {
        eventDescription: 'Some description',
        reserverName: 'Luke Skywalker',
      };
      return Reservation.build(Object.assign({}, defaults, extraValues));
    }

    test('returns an object', () => {
      const reservation = getReservation();
      const actual = getMissingValues(reservation);

      expect(typeof actual).toBe('object');
    });

    describe('the returned object', () => {
      test('is empty if reservation is not missing any required values', () => {
        const reservation = getReservation();
        const actual = getMissingValues(reservation);

        expect(actual).toEqual({});
      });

      constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
        test(`contains ${field} as "-" if ${field} is missing`, () => {
          const reservation = getReservation({ [field]: undefined });
          const actual = getMissingValues(reservation);
          const expected = { [field]: '-' };

          expect(actual).toEqual(expected);
        });
      });
    });
  });

  describe('getNextAvailableTime', () => {
    describe('if there are no reservations', () => {
      const reservations = [];

      test('returns the fromMoment given in function arguments', () => {
        const fromMoment = moment();

        expect(getNextAvailableTime(reservations, fromMoment)).toBe(fromMoment);
      });

      test('returns current time if fromMoment is not given', () => {
        const mockTime = '2015-10-10T10:00:00+03:00';
        MockDate.set(mockTime);
        expect(getNextAvailableTime(reservations).isSame(mockTime)).toBe(true);
        MockDate.reset();
      });
    });

    describe('if there are reservations', () => {
      const reservations = [
        {
          begin: '2015-10-10T12:00:00+03:00',
          end: '2015-10-10T14:00:00+03:00',
        },
        {
          begin: '2015-10-10T16:00:00+03:00',
          end: '2015-10-10T17:00:00+03:00',
        },
        {
          begin: '2015-10-10T17:00:00+03:00',
          end: '2015-10-10T18:00:00+03:00',
        },
      ];

      describe('if the fromMoment is before all of the reservations', () => {
        const fromMoment = moment('2015-10-10T10:00:00+03:00');

        test('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).toBe(fromMoment);
        });
      });

      describe('if the fromMoment is during one ongoing reservations', () => {
        const fromMoment = moment('2015-10-10T13:00:00+03:00');

        test('returns the end moment of the ongoing reservation', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          const expected = '2015-10-10T14:00:00+03:00';
          expect(nextAvailableTime.isSame(expected)).toBe(true);
        });
      });

      describe('if the fromMoment is during multiple ongoing reservations', () => {
        const fromMoment = moment('2015-10-10T16:30:00+03:00');

        test('returns the end moment of the last ongoing reservation', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          const expected = '2015-10-10T18:00:00+03:00';
          expect(nextAvailableTime.isSame(expected)).toBe(true);
        });
      });

      describe('if the fromMoment is between reservations', () => {
        const fromMoment = moment('2015-10-10T15:00:00+03:00');

        test('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).toBe(fromMoment);
        });
      });

      describe('if the fromMoment is after all of the reservations', () => {
        const fromMoment = moment('2015-10-10T20:00:00+03:00');

        test('returns the fromMoment', () => {
          const nextAvailableTime = getNextAvailableTime(reservations, fromMoment);
          expect(nextAvailableTime).toBe(fromMoment);
        });
      });
    });
  });

  describe('getNextReservation', () => {
    const previousReservation = Reservation.build({}, { startTime: moment().subtract(1, 'days') });
    const currentReservation = Reservation.build(
      {},
      { startTime: moment().subtract(20, 'minutes') }
    );
    const nextReservation = Reservation.build({}, { startTime: moment().add(2, 'hours') });
    const lastReservation = Reservation.build({}, { startTime: moment().add(4, 'hours') });
    const unorderedReservations = [
      lastReservation,
      previousReservation,
      nextReservation,
      currentReservation,
    ];

    test('returns the next reservation from a list of reservations', () => {
      expect(getNextReservation(unorderedReservations)).toEqual(nextReservation);
    });
  });
});
