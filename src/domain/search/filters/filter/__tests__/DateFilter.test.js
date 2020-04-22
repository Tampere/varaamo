import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Overlay from 'react-bootstrap/lib/Overlay';
import Button from 'react-bootstrap/lib/Button';
import DayPicker from 'react-day-picker';

import { UntranslatedDateFilter as DateFilter } from '../DateFilter';

const defaultProps = {
  name: 'test',
  label: 'foo',
  locale: 'en',
  onChange: jest.fn(),
  date: new Date(2017, 11, 10),
  t: jest.fn(translationString => translationString),
};

const findOverlay = wrapper => wrapper.find(Overlay);
const findInput = wrapper => wrapper.find(`[aria-describedby="${defaultProps.name}-error"]`);
const clickInput = wrapper => findInput(wrapper).simulate('click');
const findDatepickerWrapper = wrapper => wrapper.find(Overlay).children().first().dive();
const findDatepickerDropdownToggleButton = wrapper => wrapper.find(Button);
const findDayPicker = wrapper => wrapper.find(DayPicker);

describe('DateFilter', () => {
  const getWrapper = props => shallow(<DateFilter {...defaultProps} {...props} />);

  test('render normally', () => {
    const mockDate = new Date(2017, 11, 10);
    const originalDate = Date;

    global.Date = () => mockDate;

    const wrapper = shallow(
      <DateFilter {...defaultProps} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();

    global.Date = originalDate;
  });

  describe('input', () => {
    test('should open overlay on click', () => {
      const wrapper = getWrapper();

      expect(findOverlay(wrapper).prop('show')).toEqual(false);

      clickInput(wrapper);

      expect(findOverlay(wrapper).prop('show')).toEqual(true);
    });

    test('should not open overlay on focus', () => {
      const wrapper = getWrapper();

      expect(findOverlay(wrapper).prop('show')).toEqual(false);

      findInput(wrapper).simulate('focus');

      expect(findOverlay(wrapper).prop('show')).toEqual(false);
    });

    test('should close datepicker dropdown with enter key when date is valid', () => {
      const wrapper = getWrapper();

      clickInput(wrapper);
      findInput(wrapper).prop('onKeyDown')({ key: 'Enter' });

      expect(findOverlay(wrapper).prop('show')).toEqual(false);
    });

    test('should not close datepicker dropdown with enter key when date is invalid', () => {
      const exampleInvalidDate = '30.12.20017';
      const wrapper = getWrapper();

      wrapper.setState({ inputValue: exampleInvalidDate });

      clickInput(wrapper);
      findInput(wrapper).prop('onKeyDown')({ key: 'Enter' });

      expect(findOverlay(wrapper).prop('show')).toEqual(true);
    });

    test('value changes when date prop changes', () => {
      const date0 = new Date('2017-07-07');
      const date1 = new Date('2017-07-08');
      const wrapper = getWrapper({ date: date0 });

      expect(findInput(wrapper).prop('value')).toEqual('07.07.2017');

      // Here we are simulating a prop change. Quite ugly, but this
      // seems to be a known issue with Enzyme.
      const prevProps = wrapper.props();
      wrapper.setProps({ date: date1 });
      wrapper.instance().componentDidUpdate(prevProps);

      expect(findInput(wrapper).prop('value')).toEqual('08.07.2017');
    });
  });

  describe('when is in errorenous state', () => {
    const getWrapperWithError = (wrapper) => {
      wrapper.setState({
        // Non existent date
        inputValue: '40.02.2020',
        inputTouched: true,
      });

      return wrapper;
    };

    test('shows error correctly when input is touched and the input date is incorrect', () => {
      const wrapper = getWrapperWithError(getWrapper());
      const errorText = wrapper.find(`#${defaultProps.name}-error`);

      expect(errorText.length).toBe(1);
      expect(errorText.text()).toBe('DatePickerControl.form.error.feedback');
    });

    test('input should be described by error', () => {
      const wrapper = getWrapperWithError(getWrapper());
      const input = findInput(wrapper);

      expect(input.length).toEqual(1);
    });

    test('error should have aria role alert', () => {
      const wrapper = getWrapperWithError(getWrapper());
      const errorText = wrapper.find(`#${defaultProps.name}-error`);

      expect(errorText.prop('role')).toBe('alert');
    });
  });

  describe('datepicker dropdown', () => {
    test('should not be hidden from assistive technology', () => {
      const wrapper = findDatepickerWrapper(getWrapper());

      expect(wrapper.prop('tabIndex')).toEqual(undefined);
      expect(wrapper.prop('aria-hidden')).toEqual(undefined);
    });
  });

  describe('datepicker dropdown toggle button', () => {
    test('should toggle datepicker', () => {
      const wrapper = getWrapper();

      findDatepickerDropdownToggleButton(wrapper).prop('onClick')();

      expect(findOverlay(wrapper).prop('show')).toEqual(true);

      findDatepickerDropdownToggleButton(wrapper).prop('onClick')();

      expect(findOverlay(wrapper).prop('show')).toEqual(false);
    });

    test('should be hidden from assistive technology', () => {
      const wrapper = findDatepickerDropdownToggleButton(getWrapper());

      expect(wrapper.prop('aria-hidden')).toEqual('true');
      expect(wrapper.prop('tabIndex')).toEqual(-1);
    });
  });

  describe('datepicker', () => {
    test('should set input value when date is selected', () => {
      const selectedDate = new Date('2017-07-07');
      const wrapper = getWrapper();

      findDayPicker(wrapper).prop('onDayClick')(selectedDate);

      expect(findInput(wrapper).prop('value')).toEqual('07.07.2017');
    });
  });
});
