import MockDate from 'mockdate';
import React from 'react';
import moment from 'moment';
import simple from 'simple-mock';

import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ReservationConfirmation from 'shared/reservation-confirmation';
import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedReservationCalendarContainer as ReservationCalendarContainer } from './ReservationCalendarContainer';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';

describe('pages/resource/reservation-calendar/ReservationCalendarContainer', () => {
  const actions = {
    addNotification: simple.stub(),
    cancelReservationEdit: simple.stub(),
    changeRecurringBaseTime: () => null,
    clearReservations: simple.stub(),
    openConfirmReservationModal: simple.stub(),
    selectReservationSlot: simple.stub(),
    toggleTimeSlot: simple.stub(),
  };
  const resource = Resource.build();
  const timeSlot1 = {
    asISOString: '2016-10-10T10:00:00.000Z/2016-10-10T11:00:00.000Z',
    asString: '10:00-11:00',
    end: '2016-10-10T11:00:00.000Z',
    index: 0,
    reserved: false,
    resource: 'some-resource-id',
    start: '2016-10-10T10:00:00.000Z',
  };
  const timeSlot2 = {
    asISOString: '2016-10-10T11:00:00.000Z/2016-10-10T12:00:00.000Z',
    asString: '11:00-12:00',
    end: '2016-10-10T12:00:00.000Z',
    index: 1,
    reserved: false,
    resource: 'some-resource-id',
    start: '2016-10-10T11:00:00.000Z',
  };
  const timeSlot3 = {
    asISOString: '2016-10-11T10:00:00.000Z/2016-10-11T11:00:00.000Z',
    asString: '10:00-11:00',
    end: '2016-10-11T11:00:00.000Z',
    index: 0,
    reserved: false,
    resource: 'some-resource-id',
    start: '2016-10-11T10:00:00.000Z',
  };
  const history = {
    push: () => { },
  };
  const defaultProps = {
    actions,
    history,
    date: '2015-10-11',
    isAdmin: false,
    isEditing: false,
    isFetchingResource: false,
    isLoggedIn: true,
    isStaff: false,
    location: { search: '' },
    params: { id: resource.id },
    resource,
    selected: [],
    timeSlots: [[TimeSlot.build()], [TimeSlot.build()]],
  };
  function getWrapper(props) {
    return shallowWithIntl(<ReservationCalendarContainer {...defaultProps} {...props} />);
  }

  function makeRenderTests(props, options) {
    let wrapper;
    const { renderClosedText, renderRestrictedText, renderTimeSlots } = options;

    beforeAll(() => {
      wrapper = getWrapper(props);
    });

    test(`${renderTimeSlots ? 'renders' : 'does not render'} TimeSlots`, () => {
      expect(wrapper.find(TimeSlots).length === 1).toBe(renderTimeSlots);
    });

    test(`${renderClosedText ? 'renders' : 'does not render'} closed text`, () => {
      expect(wrapper.find('.closed-text').length === 1).toBe(renderClosedText);
    });

    test(
      `${renderRestrictedText ? 'renders' : 'does not render'} restricted text`,
      () => {
        expect(wrapper.find(ReservingRestrictedText).length === 1).toBe(renderRestrictedText);
      }
    );

    test('renders ReservationCancelModal', () => {
      expect(wrapper.find(ReservationCancelModal).length).toBe(1);
    });

    test('renders ReservationInfoModal', () => {
      expect(wrapper.find(ReservationInfoModal).length).toBe(1);
    });

    test('renders ReservationSuccessModal', () => {
      expect(wrapper.find(ReservationSuccessModal).length).toBe(1);
    });

    test('renders ReservationConfirmation', () => {
      const confirmation = wrapper.find(ReservationConfirmation);
      expect(confirmation).toHaveLength(1);
      expect(confirmation.prop('params')).toEqual(defaultProps.params);
      expect(confirmation.prop('selectedReservations')).toEqual(props.selected);
      expect(confirmation.prop('showTimeControls')).toBe(true);
      expect(confirmation.prop('timeSlots')).toEqual(props.timeSlots.length ? [timeSlot1, timeSlot2] : []);
    });
  }

  describe('render', () => {
    const now = '2016-10-10T06:00:00+03:00';

    beforeAll(() => {
      MockDate.set(now);
    });

    afterAll(() => {
      MockDate.reset();
    });

    describe('when date is in the past', () => {
      const date = '2016-10-10';
      const selected = [timeSlot1];

      describe('when resource is closed', () => {
        const timeSlots = [];
        const props = { date, selected, timeSlots };
        const options = {
          renderClosedText: true,
          renderRestrictedText: false,
          renderTimeSlots: false,
        };
        makeRenderTests(props, options);
      });

      describe('when resource is open', () => {
        const timeSlots = [[timeSlot1, timeSlot2], [timeSlot3]];
        const props = { date, selected, timeSlots };
        const options = {
          renderClosedText: false,
          renderRestrictedText: false,
          renderTimeSlots: true,
        };
        makeRenderTests(props, options);
      });
    });

    describe('when date is not in the past', () => {
      const date = '2016-12-12';
      const selected = [timeSlot1];

      describe('when resource is closed', () => {
        const timeSlots = [];
        const props = { date, selected, timeSlots };
        const options = {
          renderClosedText: true,
          renderRestrictedText: false,
          renderTimeSlots: false,
        };
        makeRenderTests(props, options);
      });

      describe('when resource is open', () => {
        const timeSlots = [[timeSlot1, timeSlot2], [timeSlot3]];
        describe('when reserving is restricted', () => {
          const restrictedResource = Resource.build({
            reservableBefore: '2016-11-11T06:00:00+03:00',
            reservableDaysInAdvance: 32,
          });
          const props = {
            date, resource: restrictedResource, selected, timeSlots
          };
          const options = {
            renderClosedText: false,
            renderRestrictedText: true,
            renderTimeSlots: false,
          };
          makeRenderTests(props, options);
        });

        describe('when reserving is not restricted', () => {
          const props = { date, selected, timeSlots };
          const options = {
            renderClosedText: false,
            renderRestrictedText: false,
            renderTimeSlots: true,
          };
          makeRenderTests(props, options);
        });
      });
    });
  });

  describe('getSelectedDateSlots', () => {
    test('returns selected date slots', () => {
      const instance = getWrapper().instance();
      const selectedSlot = {
        begin: timeSlot1.start,
        end: timeSlot1.end,
        resource: 'some-resource',
      };
      const timeSlots = [[timeSlot1, timeSlot2], [timeSlot3], []];
      const result = instance.getSelectedDateSlots(timeSlots, [selectedSlot]);
      expect(result).toEqual(timeSlots[0]);
    });

    test('returns empty if selected is not in date slots', () => {
      const instance = getWrapper().instance();
      const selectedSlot = {
        begin: '2016-10-12T10:00:00.000Z',
        end: '2016-10-12T11:00:00.000Z',
        resource: 'some-resource',
      };
      const timeSlots = [[timeSlot1, timeSlot2], [timeSlot3], []];
      const result = instance.getSelectedDateSlots(timeSlots, [selectedSlot]);
      expect(result).toEqual([]);
    });
  });

  describe('getDurationText', () => {
    const instance = getWrapper().instance();

    test(
      'returns string that contains hours and minutes when the duration over 60 minutes',
      () => {
        const duration = moment.duration({ minutes: 90 });
        const durationText = instance.getDurationText(duration);
        expect(durationText).toBe('1h 30min');
      }
    );

    test(
      'returns string that contains only minutes when the duration shorter than 60 minutes',
      () => {
        const duration = moment.duration({ minutes: 50 });
        const durationText = instance.getDurationText(duration);
        expect(durationText).toBe('50min');
      }
    );
  });

  describe('getSelectedTimeText', () => {
    let instance;
    beforeAll(() => {
      instance = getWrapper().instance();
      simple.mock(instance, 'getDateTimeText').returnWith('some text');
    });

    afterAll(() => {
      simple.restore();
    });

    test('returns empty string if selected empty', () => {
      const result = instance.getSelectedTimeText([]);

      expect(result).toBe('');
      expect(instance.getDateTimeText.callCount).toBe(0);
    });

    test('calls getDateTimeText when selected', () => {
      const selectedSlot = {
        begin: '2016-10-12T10:00:00.000Z',
        end: '2016-10-12T11:00:00.000Z',
        resource: 'some-resource',
      };
      const result = instance.getSelectedTimeText([selectedSlot]);

      expect(instance.getDateTimeText.callCount).toBe(2);
      expect(result).toBe('some text - some text (1h 0min)');
    });
  });

  describe('handleEditCancel', () => {
    test('calls cancelReservationEdit', () => {
      const instance = getWrapper().instance();
      instance.handleEditCancel();
      expect(actions.cancelReservationEdit.callCount).toBe(1);
    });
  });

  describe('handleReserveClick', () => {
    const selected = [
      {
        begin: '2016-10-12T10:00:00+03:00',
        end: '2016-10-12T11:00:00+03:00',
        resource: 'some-resource',
      },
    ];
    const now = '2016-10-12T08:00:00+03:00';
    let historyMock;

    beforeAll(() => {
      MockDate.set(now);
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
      MockDate.reset();
    });

    test(
      'calls actions addNotification when user has max open reservations for resource',
      () => {
        const isAdmin = false;
        const maxReservationsPerUser = 1;
        const reservations = [
          {
            end: '2016-10-12T09:00:00+03:00',
            isOwn: true,
          },
          {
            end: '2016-10-12T10:00:00+03:00',
            isOwn: false,
          },
        ];
        const resourceWithReservations = Resource.build({
          maxReservationsPerUser,
          reservations,
        });
        const instance = getWrapper({
          isAdmin,
          resource: resourceWithReservations,
          selected,
        }).instance();
        defaultProps.actions.addNotification.reset();
        instance.handleReserveClick();
        expect(defaultProps.actions.addNotification.callCount).toBe(1);
      }
    );
    test('calls history push with correct path', () => {
      const expectedPath = `/reservation?begin=10:00&date=2016-10-12&end=11:00&id=&resource=${
        selected[0].resource
      }`;
      const instance = getWrapper({ selected }).instance();
      instance.handleReserveClick();
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
