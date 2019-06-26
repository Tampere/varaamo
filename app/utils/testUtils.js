import { shallow } from 'enzyme';
import forEach from 'lodash/forEach';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import set from 'lodash/set';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { RSAA } from 'redux-api-middleware';

import rootReducer from 'state/rootReducer';
import enMessages from 'i18n/messages/en.json';

const testMessages = mapValues(enMessages, (value, key) => key);

function createApiTest(options) {
  /** Create some tests for an API action.
   *
   * Options can be an object like this:
   * {
   *  name: name of test (string),
   *  action: action creator (function),
   *  args: arguments for the action creator (array),
   *  tests: {
   *    method: HTTP method (string),
   *    endpoint: URL (string),
   *    headers: request headers (object)
   *    body: request body (string)
   *    meta: meta of the action (object)
   *    request: {
   *      type: request action type (string),
   *      hasSideEffect: (boolean)
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *    success: {
   *      type: success action type (string),
   *      hasSideEffect: (boolean)
   *      payload: {
   *        data: payload response data (json-like)
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *    error: {
   *      type: error action type (string),
   *      hasSideEffect: (boolean),
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *  },
   * }
   */
  const tests = options.tests;
  describe(options.name, () => {
    let action;
    let callAPI;

    beforeAll(() => {
      action = options.action.apply(null, options.args);
      callAPI = action[RSAA];
    });

    test('returns an object with a RSAA key', () => {
      expect(callAPI).toBeDefined();
    });

    tests.method && test(`uses ${tests.method}`, () => {
      expect(callAPI.method).toBe(tests.method);
    });

    tests.body && test('has correct body', () => {
      const body = (
        tests.body instanceof Object
          ? JSON.parse(callAPI.body)
          : callAPI.body
      );
      expect(body).toEqual(tests.body);
    });

    tests.endpoint && test('uses correct endpoint', () => {
      expect(callAPI.endpoint).toBe(tests.endpoint);
    });

    tests.meta && test('has correct meta', () => {
      expect(action.meta).toEqual(tests.meta);
    });

    describe('types', () => {
      const mockAction = {
        [RSAA]: {
          types: [{
            type: (
              (tests.request && tests.request.type) || 'Specify request.type'
            )
          }],
        },
      };

      ['request', 'success', 'error'].forEach((actionTypeName, index) => {
        tests[actionTypeName] && describe(actionTypeName, () => {
          const actionTests = tests[actionTypeName];
          const extraTests = actionTests.extra && actionTests.extra.tests;
          let typeAction;
          beforeAll(() => {
            typeAction = callAPI.types[index];
          });

          actionTests.type && test('has correct type', () => {
            expect(typeAction.type).toBe(actionTests.type);
          });

          extraTests && forIn(extraTests, (value, name) => {
            const getParams = () => ({
              typeAction,
              mockAction,
              meta: (
                actionTypeName === 'request'
                  ? typeAction.meta
                  : typeAction.meta(mockAction)
              ),
            });
            const func = (
              value.length === 2
                ? done => value(getParams(), done)
                : () => value(getParams())
            );
            test(name, func);
          });

          actionTypeName === 'success' && describe('payload', () => {
            let payload;
            let response;
            let promise;
            const payloadTests = actionTests.payload || {};
            const jsonData = payloadTests.data || {};

            beforeAll(() => {
              payload = typeAction.payload;
              response = {
                headers: {
                  get: () => 'application/json',
                },
                json: () => Promise.resolve(jsonData),
              };
            });

            beforeEach(() => {
              promise = payload({ type: actionTests.type }, {}, response);
            });

            test('exists', () => {
              expect(payload).toBeDefined();
            });

            payloadTests.tests && forIn(payloadTests.tests, (value, name) => {
              const func = (
                value.length === 2
                  ? done => value({ promise, payload, response }, done)
                  : () => value({ promise, payload, response })
              );
              test(name, func);
            });
          });
        });
      });
    });
  });
}

function getDefaultRouterProps() {
  return {
    location: {
      query: {},
    },
    params: {},
  };
}

function getInitialState() {
  return rootReducer(undefined, { type: 'NOOP' });
}

function getState(extraState = {}) {
  const state = getInitialState();
  const newState = {};

  forEach(Object.keys(extraState), (key) => {
    const mergedValue = merge({}, get(state, key), extraState[key]);
    set(newState, key, mergedValue);
  });
  return merge({}, state, newState);
}

function makeButtonTests(button, name, expectedText, expectedOnClickFunction) {
  test(`is an ${name} button`, () => {
    expect(button.props().children).toBe(expectedText);
  });

  test('clicking the button calls correct onClick function', () => {
    expectedOnClickFunction.reset();
    button.props().onClick();

    expect(expectedOnClickFunction.callCount).toBe(1);
  });
}

// Utilities for shallow testing components that use react-intl and injectT.
const intlProvider = new IntlProvider({ locale: 'en', messages: testMessages }, {});
const { intl } = intlProvider.getChildContext();

function shallowWithIntl(node, context) {
  const nodeWithIntl = React.cloneElement(node, { intl });
  return shallow(nodeWithIntl, { context: { ...context, intl } }).shallow({ context });
}

export {
  createApiTest,
  getDefaultRouterProps,
  getInitialState,
  getState,
  makeButtonTests,
  shallowWithIntl,
};
