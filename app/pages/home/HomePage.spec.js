import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';
import Link from 'react-router-dom/Link';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedHomePage as HomePage } from './HomePage';
import HomeSearchBox from './HomeSearchBox';

describe('pages/home/HomePage', () => {
  const history = {
    push: () => {},
  };

  const defaultProps = {
    history,
    actions: {
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    purposes: [
      {
        label: 'Purpose 1',
        value: 'purpose-1',
      },
      {
        label: 'Purpose 2',
        value: 'purpose-2',
      },
      {
        label: 'Purpose 3',
        value: 'purpose-3',
      },
      {
        label: 'Purpose 4',
        value: 'purpose-4',
      },
    ],
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<HomePage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('className')).toBe('app-HomePageContent');
      expect(pageWrapper.prop('title')).toBe('HomePage.title');
    });

    test('renders HomeSearchBox with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const homeSearchBox = wrapper.find(HomeSearchBox);
      expect(homeSearchBox).toHaveLength(1);
      expect(homeSearchBox.prop('onSearch')).toBe(instance.handleSearch);
    });

    describe('Loader', () => {
      test('renders Loader with correct props when not fetching purposes', () => {
        const loader = getWrapper().find(Loader);
        expect(loader.length).toBe(1);
        expect(loader.at(0).prop('loaded')).toBe(true);
      });

      test('renders Loader with correct props when fetching purposes', () => {
        const loader = getWrapper({ isFetchingPurposes: true }).find(Loader);
        expect(loader.length).toBe(1);
        expect(loader.at(0).prop('loaded')).toBe(false);
      });

      test('renders purpose banners', () => {
        const banners = getWrapper().find('.app-HomePageContent__banner');
        expect(banners.length).toBe(defaultProps.purposes.length);
      });
    });

    describe('Purpose banners', () => {
      let wrapper;

      beforeAll(() => {
        wrapper = getWrapper();
      });

      afterAll(() => {
        simple.restore();
      });

      test(' have at least a Link component', () => {
        expect(wrapper.find(Link)).toHaveLength(defaultProps.purposes.length);
        expect(wrapper.find(Link).first().prop('to')).toContain(defaultProps.purposes[0].value);
      });
    });
  });

  describe('componentDidMount', () => {
    function callComponentDidMount(props, extraActions) {
      const actions = { ...defaultProps.actions, ...extraActions };
      const instance = getWrapper({ ...props, actions }).instance();
      instance.componentDidMount();
    }

    test('fetches purposes', () => {
      const fetchPurposes = simple.mock();
      callComponentDidMount({}, { fetchPurposes });
      expect(fetchPurposes.callCount).toBe(1);
    });
  });

  describe('handleSearch', () => {
    const value = 'some value';
    const expectedPath = `/search?search=${value}`;
    let historyMock;

    beforeAll(() => {
      const instance = getWrapper().instance();
      historyMock = simple.mock(history, 'push');
      instance.handleSearch(value);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory push with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
