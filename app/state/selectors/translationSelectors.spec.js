import constants from 'constants/AppConstants';

import { getState } from 'utils/testUtils';
import {
  createTranslatedSelector,
  currentLanguageSelector,
} from './translationSelectors';

describe('state/selectors/dataSelectors', () => {
  describe('currentLanguageSelector', () => {
    test('returns default language if state does not contain locale', () => {
      const state = {};
      expect(currentLanguageSelector(state)).toBe(constants.DEFAULT_LOCALE);
    });

    test('returns locale from state', () => {
      const locale = 'en';
      const state = getState({ intl: { locale } });
      expect(currentLanguageSelector(state)).toBe(locale);
    });

    test('returns sv if locale is se', () => {
      const locale = 'se';
      const state = getState({ intl: { locale } });
      expect(currentLanguageSelector(state)).toBe('sv');
    });
  });

  describe('createTranslatedSelector', () => {
    describe('items in an array', () => {
      test('are translated', () => {
        const items = [
          { id: 1, name: { en: 'Some name' } },
          { id: 2, name: { en: 'Other name' } },
        ];
        const expected = [
          { id: 1, name: 'Some name' },
          { id: 2, name: 'Other name' },
        ];
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });

      test('support translating values in arrays', () => {
        const items = [
          {
            id: 1,
            images: [
              { caption: { en: 'some caption' } },
              { caption: { en: 'other caption' } },
            ],
            regularArray: ['foo', 'bar'],
          },
        ];
        const expected = [
          {
            id: 1,
            images: [
              { caption: 'some caption' },
              { caption: 'other caption' },
            ],
            regularArray: ['foo', 'bar'],
          },
        ];
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });

      test('support translating values in an object', () => {
        const items = [
          {
            id: 1,
            type: {
              name: { en: 'some name' },
            },
          },
        ];
        const expected = [
          {
            id: 1,
            type: {
              name: 'some name',
            },
          },
        ];
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });
    });

    describe('items in an object', () => {
      test('are translated', () => {
        const items = {
          1: { id: 1, name: { en: 'Some name' } },
          2: { id: 2, name: { en: 'Other name' } },
        };
        const expected = {
          1: { id: 1, name: 'Some name' },
          2: { id: 2, name: 'Other name' },
        };
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });

      test('support translating values in arrays', () => {
        const items = {
          1: {
            id: 1,
            images: [
              { caption: { en: 'some caption' } },
              { caption: { en: 'other caption' } },
            ],
            regularArray: ['foo', 'bar'],
          },
        };
        const expected = {
          1: {
            id: 1,
            images: [
              { caption: 'some caption' },
              { caption: 'other caption' },
            ],
            regularArray: ['foo', 'bar'],
          },
        };
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });

      test('support translating values in an object', () => {
        const items = {
          1: {
            id: 1,
            type: {
              name: { en: 'some name' },
            },
          },
        };
        const expected = {
          1: {
            id: 1,
            type: {
              name: 'some name',
            },
          },
        };
        const toTranslateSelector = () => items;
        const state = getState({ intl: { locale: 'en' } });
        const selected = createTranslatedSelector(toTranslateSelector)(state);
        expect(selected).toEqual(expected);
      });
    });
  });
});
