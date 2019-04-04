import { openingHoursMonth } from 'constants/ResourceConstants';

// import moment from 'moment';

import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import utils from './utils';

describe('pages/resource/reservation-calendar/utils', () => {
  const slot = {
    start: '2015-10-10T12:00:00Z',
    end: '2015-10-10T12:30:00Z',
  };
  const slotOutsideOpeningHours = {
    start: '2015-10-12T12:00:00Z',
    end: '2015-10-12T12:30:00Z',
  };
  const selected = [{
    begin: '2015-10-10T12:00:00Z',
    end: '2015-10-10T12:30:00Z',
  }];

  describe('getNextDayFromDate', () => {
    test('returns null if no date', () => {
      const actual = utils.getNextDayFromDate();
      expect(actual).toBeNull();
    });

    test('returns next day', () => {
      const actual = utils.getNextDayFromDate('2018-05-24');
      expect(actual).toBe('2018-05-25');
    });
  });

  describe('getNextWeeksDays', () => {
    test('0 if date is Monday', () => {
      const actual = utils.getNextWeeksDays('2018-05-21');
      expect(actual).toBe(0);
    });

    test('1 if date is Saturday', () => {
      const actual = utils.getNextWeeksDays('2018-05-26');
      expect(actual).toBe(1);
    });

    test('2 if date is Sunday', () => {
      const actual = utils.getNextWeeksDays('2018-05-27');
      expect(actual).toBe(2);
    });
  });

  describe('getSecondDayFromDate', () => {
    test('returns null if no date', () => {
      const actual = utils.getSecondDayFromDate();
      expect(actual).toBeNull();
    });

    test('returns next day', () => {
      const actual = utils.getSecondDayFromDate('2018-05-24');
      expect(actual).toBe('2018-05-26');
    });
  });

  describe('isInsideOpeningHours', () => {
    test('returns true if slot start and end is inside opening hours', () => {
      const actual = utils.isInsideOpeningHours(slot, openingHoursMonth);
      expect(actual).toBe(true);
    });

    test('returns false if slot start and end is not inside opening hours', () => {
      const actual = utils.isInsideOpeningHours(slotOutsideOpeningHours, openingHoursMonth);
      expect(actual).toBe(false);
    });
  });

  describe('isSlotAfterSelected', () => {
    test('returns true if slot is after selected begin', () => {
      const actual = utils.isSlotAfterSelected(slot, selected);
      expect(actual).toBe(true);
    });

    test('returns false if slot is before selected begin', () => {
      const actual = utils.isSlotAfterSelected(slot, [{ begin: '2015-10-10T13:00:00Z' }]);
      expect(actual).toBe(false);
    });

    test('returns false if slot is editing', () => {
      const actual = utils.isSlotAfterSelected({ editing: true }, selected);
      expect(actual).toBe(false);
    });
  });

  describe('isSlotSelectable', () => {
    const resource = Resource.build();
    const isAdmin = false;
    const lastSelectableFound = false;

    test('returns true if slot is empty', () => {
      const actual = utils.isSlotSelectable(null, selected, resource,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(true);
    });

    test('returns true if selected is empty', () => {
      const actual = utils.isSlotSelectable(slot, [], resource,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(true);
    });

    test('returns true if resource is empty', () => {
      const actual = utils.isSlotSelectable(slot, selected, null,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(true);
    });

    test('returns false if slot is reserved', () => {
      const slotReserved = TimeSlot.build({ reserved: true });
      const actual = utils.isSlotSelectable(slotReserved, selected, resource,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(false);
    });

    test('returns false if lastSelectableFound is true', () => {
      const actual = utils.isSlotSelectable(slot, selected, resource, true, isAdmin);
      expect(actual).toBe(false);
    });

    test(
      'returns false if not admin and slot start is after max period since selected begin',
      () => {
        const slotAfterMaxPeriod = {
          start: '2015-10-10T13:00:00Z',
          end: '2015-10-10T13:30:00Z',
        };
        const resourceMaxPeriod = Resource.build({ maxPeriod: '00:30:00' });
        const actual = utils.isSlotSelectable(slotAfterMaxPeriod, selected,
          resourceMaxPeriod, lastSelectableFound, isAdmin);
        expect(actual).toBe(false);
      }
    );

    test(
      'returns true if is admin and slot start is after max period since selected begin',
      () => {
        const slotAfterMaxPeriod = {
          start: '2015-10-10T13:00:00Z',
          end: '2015-10-10T13:30:00Z',
        };
        const resourceMaxPeriod = Resource.build({ maxPeriod: '00:30:00' });
        const actual = utils.isSlotSelectable(slotAfterMaxPeriod, selected,
          resourceMaxPeriod, lastSelectableFound, true);
        expect(actual).toBe(true);
      }
    );

    test('returns true if selected begin is before slot start', () => {
      const actual = utils.isSlotSelectable(slot, selected, resource,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(true);
    });

    test('returns false if selected begin is after slot start', () => {
      const selectedAfterSlot = [{ begin: '2015-10-10T13:00:00Z' }];
      const actual = utils.isSlotSelectable(slot, selectedAfterSlot, resource,
        lastSelectableFound, isAdmin);
      expect(actual).toBe(false);
    });
  });

  describe('isSlotSelected', () => {
    test('returns false if slot is empty', () => {
      const actual = utils.isSlotSelected(null, selected);
      expect(actual).toBe(false);
    });

    test('returns false if selected is empty', () => {
      const actual = utils.isSlotSelected(slot, []);
      expect(actual).toBe(false);
    });

    test('returns true if slot is inside selected', () => {
      const actual = utils.isSlotSelected(slot, selected);
      expect(actual).toBe(true);
    });

    test('returns false if slot is not inside selected', () => {
      const selectedOutsideSlot = [{
        begin: '2015-10-10T10:00:00Z',
        end: '2015-10-10T10:30:00Z',
      }];
      const actual = utils.isSlotSelected(slot, selectedOutsideSlot);
      expect(actual).toBe(false);
    });
  });
});
