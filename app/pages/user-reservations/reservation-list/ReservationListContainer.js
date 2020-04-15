import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import Pagination from '../../../../src/common/pagination/Pagination';
import injectT from '../../../i18n/injectT';
import ReservationListItem from './ReservationListItem';
import reservationListSelector from './reservationListSelector';

class UnconnectedReservationListContainer extends Component {
  constructor(props) {
    super(props);
    this.renderReservationListItem = this.renderReservationListItem.bind(this);
  }

  renderReservationListItem(reservation) {
    const {
      isAdmin,
    } = this.props;

    return (
      <ReservationListItem
        isAdmin={isAdmin}
        key={reservation.url}
        reservation={reservation}
      />
    );
  }

  render() {
    const {
      emptyMessage,
      loading,
      reservations,
      page,
      pages,
      t,
    } = this.props;

    return (
      <Loader loaded={!loading}>
        {reservations.length > 0
          ? (
            <div>
              <ul className="reservation-list">
                {reservations.map(this.renderReservationListItem)}
              </ul>
              <Pagination
                onChange={this.props.onPageChange}
                page={page}
                pages={pages}
              />
            </div>
          )
          : <p>{emptyMessage || t('ReservationListContainer.emptyMessage')}</p>
        }
      </Loader>
    );
  }
}

UnconnectedReservationListContainer.propTypes = {
  emptyMessage: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
};
UnconnectedReservationListContainer = injectT(UnconnectedReservationListContainer);  // eslint-disable-line

export { UnconnectedReservationListContainer };
export default connect(reservationListSelector)(UnconnectedReservationListContainer);
