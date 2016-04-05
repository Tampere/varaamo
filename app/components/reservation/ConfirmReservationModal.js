import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import TimeRange from 'components/common/TimeRange';
import ReservationForm from 'containers/ReservationForm';

class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.getFormFields = this.getFormFields.bind(this);
    this.getFormInitialValues = this.getFormInitialValues.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.renderIntroTexts = this.renderIntroTexts.bind(this);
  }

  onConfirm(values) {
    const { isPreliminaryReservation, onClose, onConfirm } = this.props;
    onClose();
    if (!isPreliminaryReservation) {
      onConfirm(values);
    }
  }

  getFormFields() {
    const {
      isPreliminaryReservation,
      resource,
    } = this.props;
    const isAdmin = resource.userPermissions.isAdmin;
    const formFields = [];

    if (isPreliminaryReservation) {
      formFields.push('name', 'email', 'phone', 'description', 'address');
    }
    if (isAdmin) {
      formFields.push('comments');
    }

    return formFields;
  }

  getFormInitialValues() {
    const {
      isEditing,
      reservationsToEdit,
      selectedReservations,
    } = this.props;
    const initialValues = {};

    if (isEditing) {
      initialValues.comments = reservationsToEdit.length ? reservationsToEdit[0].comments : '';
    } else {
      initialValues.comments = selectedReservations.length ? selectedReservations[0].comments : '';
    }

    return initialValues;
  }

  getModalTitle(isEditing, isPreliminaryReservation) {
    if (isEditing) {
      return 'Muutosten vahvistus';
    }
    if (isPreliminaryReservation) {
      return 'Alustava varaus';
    }
    return 'Varauksen vahvistus';
  }

  renderIntroTexts() {
    const {
      isEditing,
      isPreliminaryReservation,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (isEditing) {
      return (
        <div>
          <p><strong>Oletko varma että haluat muuttaa varaustasi?</strong></p>
          <p>Ennen muutoksia:</p>
          <ul>
            {map(reservationsToEdit, this.renderReservation)}
          </ul>
          <p>Muutosten jälkeen:</p>
          <ul>
            {map(selectedReservations, this.renderReservation)}
          </ul>
        </div>
      );
    }

    const helpText = isPreliminaryReservation ?
      'Olet tekemässä alustavaa varausta seuraaville ajoille:' :
      'Oletko varma että haluat tehdä seuraavat varaukset?';

    return (
      <div>
        <p><strong>{helpText}</strong></p>
        <ul>
          {map(selectedReservations, this.renderReservation)}
        </ul>
        {isPreliminaryReservation && (
          <p>
            Täytä vielä seuraavat tiedot alustavaa varausta varten.
            Tähdellä (*) merkityt tiedot ovat pakollisia.
          </p>
        )}
      </div>
    );
  }

  renderReservation(reservation) {
    return (
      <li key={reservation.begin}>
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      isPreliminaryReservation,
      onClose,
      show,
    } = this.props;

    return (
      <Modal
        animation={false}
        className="confirm-reservation-modal"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderIntroTexts()}
          <ReservationForm
            fields={this.getFormFields()}
            initialValues={this.getFormInitialValues()}
            isMakingReservations={isMakingReservations}
            onClose={onClose}
            onConfirm={this.onConfirm}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPreliminaryReservation: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
