import { getState } from 'utils/testUtils';
import {
  createResourceSelector,
  purposesSelector,
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
} from './dataSelectors';

describe('state/selectors/dataSelectors', () => {
  describe('purposesSelector', () => {
    test('returns purposes translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.purposes': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = purposesSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('reservationsSelector', () => {
    test('returns reservations from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.reservations': {
          1: { id: 1, foo: 'bar' },
          2: { id: 2, foo: 'bar' },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, foo: 'bar' },
        2: { id: 2, foo: 'bar' },
      };
      const selected = reservationsSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('resourcesSelector', () => {
    test('returns resources translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.resources': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = resourcesSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('unitsSelector', () => {
    test('returns units translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.units': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = unitsSelector(state);
      expect(selected).toEqual(expected);
    });
  });

  describe('createResourceSelector', () => {
    test('returns the resource specified by the given id selector', () => {
      const resource = { id: 'r-1' };
      const idSelector = () => resource.id;
      const state = getState({
        'data.resources': { [resource.id]: resource },
      });
      const selected = createResourceSelector(idSelector)(state);
      expect(selected).toEqual(resource);
    });

    test('returns an empty object if resource does not exist', () => {
      const idSelector = () => 'r-999';
      const state = getState();
      const selected = createResourceSelector(idSelector)(state);
      expect(selected).toEqual({});
    });
  });
});
