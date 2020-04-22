/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

import Error from './Error';
import injectT from '../../../i18n/injectT';

function Input({
  input,
  meta: { error, touched },
  t,
  label,
  autoComplete,
}) {
  return (
    <div className="app-ReservationPage__formfield">
      <label>
        {label}
        <input {...input} autoComplete={autoComplete} />
      </label>
      {touched && error && <Error error={t(error)} />}
    </div>
  );
}

Input.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
};

export default injectT(Input);
