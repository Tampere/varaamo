import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import RBFormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import InfoPopover from 'shared/info-popover';

function FormControl({
  controlProps = {}, help, id, info, label, type, validationState
}) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <Col componentClass={ControlLabel} sm={3}>
        {label}
        {' '}
        {info && <InfoPopover id={`${id}-info`} placement="right" text={info} />}
      </Col>
      <Col sm={9}>
        <RBFormControl
          {...controlProps}
          componentClass={type === 'textarea' ? 'textarea' : undefined}
          type={type !== 'textarea' ? type : undefined}
        />
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
  );
}

FormControl.propTypes = {
  controlProps: PropTypes.object,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default FormControl;
