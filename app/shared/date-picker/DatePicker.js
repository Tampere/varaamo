import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';

const dateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

DatePicker.propTypes = {
  dateFormat: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function DatePicker(props) {
  const pickerDateFormat = props.dateFormat || localizedDateFormat;

  return (
    <DayPickerInput
      classNames={{
        container: 'date-picker',
        overlay: 'date-picker-overlay',
      }}
      dayPickerProps={{
        showOutsideDays: true,
        localeUtils: MomentLocaleUtils,
      }}
      format={pickerDateFormat}
      formatDate={formatDate}
      keepFocus={false}
      onDayChange={date => props.onChange(formatDate(date, dateFormat))}
      parseDate={parseDate}
      value={new Date(props.value)}
    />
  );
}

export default DatePicker;
