import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';

import {
  UnconnectedReservationForm as ReservationForm,
  validate,
} from 'containers/ReservationForm';

describe('Container: ReservationForm', () => {
  const fields = {
    name: {},
    email: {},
    phone: {},
    description: {},
    address: {},
  };
  const props = {
    fields,
    handleSubmit: simple.mock(),
    isMakingReservations: false,
    onClose: simple.mock(),
    onConfirm: simple.mock(),
  };
  const wrapper = shallow(<ReservationForm {...props} />);

  describe('validation', () => {
    let validValues;

    beforeEach(() => {
      validValues = {
        name: 'Luke',
        email: 'luke@skywalker.com',
        phone: '1234567',
        description: 'Some description...',
        address: 'Desert street 5, Mos Eisley',
      };
    });

    it('should not return errors for valid values', () => {
      const errors = validate(validValues, { fields: Object.keys(fields) });
      expect(errors).to.deep.equal({});
    });

    describe('name', () => {
      it('should return an error if name field exists but value is missing', () => {
        validValues.name = undefined;
        const errors = validate(validValues, { fields: ['name'] });
        expect(errors.name).to.exist;
      });

      it('should not return an error if name field does not exist', () => {
        validValues.name = undefined;
        const errors = validate(validValues, { fields: [] });
        expect(errors.name).to.not.exist;
      });
    });

    describe('email', () => {
      it('should return an error if email field exists but value is missing', () => {
        validValues.email = undefined;
        const errors = validate(validValues, { fields: ['email'] });
        expect(errors.email).to.exist;
      });

      it('should not return an error if email field does not exist', () => {
        validValues.email = undefined;
        const errors = validate(validValues, { fields: [] });
        expect(errors.email).to.not.exist;
      });

      it('should return an error if email field exists but email is invalid', () => {
        validValues.email = 'luke@';
        const errors = validate(validValues, { fields: ['email'] });
        expect(errors.email).to.exist;
      });
    });

    describe('phone', () => {
      it('should return an error if phone field exists but value is missing', () => {
        validValues.phone = undefined;
        const errors = validate(validValues, { fields: ['phone'] });
        expect(errors.phone).to.exist;
      });

      it('should not return an error if phone field does not exist', () => {
        validValues.phone = undefined;
        const errors = validate(validValues, { fields: [] });
        expect(errors.phone).to.not.exist;
      });
    });

    describe('description', () => {
      it('should return an error if description field exists but value is missing', () => {
        validValues.description = undefined;
        const errors = validate(validValues, { fields: ['description'] });
        expect(errors.description).to.exist;
      });

      it('should not return an error if description field does not exist', () => {
        validValues.description = undefined;
        const errors = validate(validValues, { fields: [] });
        expect(errors.description).to.not.exist;
      });
    });

    describe('address', () => {
      it('should return an error if address field exists but value is missing', () => {
        validValues.address = undefined;
        const errors = validate(validValues, { fields: ['address'] });
        expect(errors.address).to.exist;
      });

      it('should not return an error if address field does not exist', () => {
        validValues.address = undefined;
        const errors = validate(validValues, { fields: [] });
        expect(errors.address).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    it('should render a form', () => {
      const form = wrapper.find('form');
      expect(form.length).to.equal(1);
    });

    describe('form inputs', () => {
      const inputs = wrapper.find(Input);

      it('should render 5 inputs', () => {
        expect(inputs.length).to.equal(5);
      });

      it('should render a text input with label "Nimi*"', () => {
        const nameInput = inputs.at(0);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Nimi*');
      });

      it('should render a email input with label "Sähköposti*"', () => {
        const nameInput = inputs.at(1);

        expect(nameInput.props().type).to.equal('email');
        expect(nameInput.props().label).to.equal('Sähköposti*');
      });

      it('should render a text input with label "Puhelin*"', () => {
        const nameInput = inputs.at(2);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Puhelin*');
      });

      it('should render a textarea input with label "Tilaisuuden kuvaus*"', () => {
        const nameInput = inputs.at(3);

        expect(nameInput.props().type).to.equal('textarea');
        expect(nameInput.props().label).to.equal('Tilaisuuden kuvaus*');
      });

      it('should render a text input with label "Osoite*"', () => {
        const nameInput = inputs.at(4);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Osoite*');
      });
    });

    describe('form buttons', () => {
      const buttons = wrapper.find(Button);

      it('should render two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('Cancel button', () => {
        const button = buttons.at(0);

        it('the first button should read "Peruuta"', () => {
          expect(button.props().children).to.equal('Peruuta');
        });

        it('clicking it should call props.onClose', () => {
          props.onClose.reset();
          button.props().onClick();

          expect(props.onClose.callCount).to.equal(1);
        });
      });

      describe('Confirm button', () => {
        const button = buttons.at(1);

        it('the second button should read "Tallenna"', () => {
          expect(button.props().children).to.equal('Tallenna');
        });
      });
    });
  });
});
