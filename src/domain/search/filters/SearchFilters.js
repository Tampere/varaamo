import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';

import constants from '../../../../app/constants/AppConstants';
import * as searchUtils from '../utils';
import injectT from '../../../../app/i18n/injectT';
import TextFilter from './filter/TextFilter';
import DateFilter from './filter/DateFilter';
import SelectFilter from './filter/SelectFilter';
import ToggleFilter from './filter/ToggleFilter';
import TimeRangeFilter from './filter/TimeRangeFilter';
import PositionControl from '../../../../app/pages/search/controls/PositionControl';
import iconTimes from './images/times.svg';

function timeToDatetime(time, date) {
  const [hours, minutes] = time.split(':');

  return moment(date).startOf('day').hours(hours).minutes(minutes)
    .format(constants.DATETIME_FORMAT);
}

function injectDateIntoAvailableBetween(availableBetween, date) {
  const [startTime, endTime, duration] = availableBetween.split(',');
  const startDatetime = timeToDatetime(startTime, date);
  const endDatetime = timeToDatetime(endTime, date);

  return [startDatetime, endDatetime, duration].join(',');
}

class SearchFilters extends React.Component {
  static propTypes = {
    filters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    isGeolocationEnabled: PropTypes.bool,
    onGeolocationToggle: PropTypes.func.isRequired,
    isLoadingPurposes: PropTypes.bool,
    isLoadingUnits: PropTypes.bool,
    units: PropTypes.array.isRequired,
    purposes: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filters: this.parseFilters(props.filters),
    };
  }

  componentDidUpdate(prevProps) {
    const { filters } = this.props;

    // TODO: This is an anti pattern, so we should find a better way of doing this.
    if (!isEqual(filters, prevProps.filters)) {
      // eslint-disable-next-line
      this.setState({
        filters: this.parseFilters(filters),
      });
    }
  }

  parseAvailableBetweenFilter = (availableBetween) => {
    const [startDatetime, endDatetime, duration] = availableBetween.split(',');
    const startTime = moment(startDatetime, constants.DATETIME_FORMAT).format('HH:mm');
    const endTime = moment(endDatetime, constants.DATETIME_FORMAT).format('HH:mm');

    return [startTime, endTime, duration].join(',');
  }

  // We use date and availableBetween at the same time in our searches.
  // This causes a conflict of interest--both of them use the same
  // medium, time, to filter the results. Date targets a specific date
  // and availableBetween targets a starting date and time plus and
  // ending date and time. As far as I understand, availableBetween
  // takes precedence.

  // This means that when the user has selected a time and a date we
  // need to make sure that the date(s) in availableBetween are in sync
  // with the selected date value. If not, the user will face unexpected
  // behaviour when changing the date while a time range is selected. In
  // this kind of an instance, the results wouldn't be shown from the
  // selected date, but instead from the date(s) that are defined in
  // availableBetween.

  // To avoid this issue, availableBetween is represented as only time
  // values within this component. Its date portion is discarded when it
  // is read into this component's state. The selected date is injected
  // back into availableBetween before sending it in a callback in order
  // to create sound data that matches user expectations.
  parseFilters = (filters) => {
    const { availableBetween } = filters;

    if (!availableBetween) {
      return filters;
    }

    const nextFilters = {
      ...filters,
      availableBetween: this.parseAvailableBetweenFilter(availableBetween),
    };

    return nextFilters;
  }

  onFilterChange = (filterName, filterValue) => {
    const { filters } = this.state;

    const newFilters = {
      ...omit(filters, filterName),
    };

    if (filterValue) {
      newFilters[filterName] = filterValue;
    }

    this.setState({
      filters: newFilters,
    });
  };

  onSearch = () => {
    const { onChange } = this.props;
    const { filters, filters: { availableBetween, date } } = this.state;
    const nextFilters = {
      ...omit(filters, 'page'),
    };

    // Inject date back into availableBetween before sending the filter.
    if (availableBetween) {
      nextFilters.availableBetween = injectDateIntoAvailableBetween(availableBetween, date);
    }

    onChange(nextFilters);
  };

  onReset = () => {
    const { onChange } = this.props;

    onChange({});
  };

  hasFilters = () => {
    const { filters } = this.props;

    return !isEmpty(omit(filters, 'page'));
  };

  render() {
    const {
      t,
      intl,
      isGeolocationEnabled,
      isLoadingPurposes,
      isLoadingUnits,
      purposes,
      units,
      onGeolocationToggle,
    } = this.props;
    const {
      filters,
    } = this.state;

    const date = get(filters, 'date', moment().format(constants.DATE_FORMAT));
    const municipality = get(filters, 'municipality', '');
    const availableBetween = get(filters, 'availableBetween', '');

    return (
      <div className="app-SearchFilters">
        <Grid>
          <div className="app-SearchFilters__content">
            <h1>{t('SearchFilters.title')}</h1>
            <Row>
              <Col className="app-SearchFilters__control" md={6} sm={12}>
                <TextFilter
                  id="searchField"
                  label={t('SearchFilters.searchLabel')}
                  onChange={value => this.onFilterChange('search', value)}
                  onSearch={() => this.onSearch()}
                  value={get(filters, 'search', '')}
                />
              </Col>
              <Col className="app-SearchFilters__control" md={6} sm={12}>
                <DateFilter
                  date={moment(get(filters, 'date', new Date())).toDate()}
                  label={t('SearchFilters.dateLabel')}
                  name="date-filter"
                  onChange={(newValue) => {
                    this.onFilterChange('date', moment(newValue).format(constants.DATE_FORMAT));
                  }}
                />
                <Button
                  bsStyle="primary"
                  className="app-SearchFilters__today-button"
                  disabled={moment(date).isSame(moment(), 'day')}
                  key="today-button"
                  onClick={() => this.onFilterChange('date', moment().format(constants.DATE_FORMAT))}
                  type="submit"
                >
                  {t('TimePickerCalendar.info.today')}
                </Button>
              </Col>
            </Row>
            <Panel
              defaultExpanded={this.hasFilters()}
              header={t('SearchFilters.advancedSearch')}
            >
              <Row>
                <Col md={12}>
                  <SelectFilter
                    id="municipality"
                    isMulti
                    label={t('SearchFilters.municipalityLabel')}
                    onChange={(items) => {
                      this.onFilterChange(
                        'municipality',
                        items ? items.map(item => item.value).join(',') : null,
                      );
                    }}
                    options={searchUtils.getMunicipalityOptions()}
                    value={municipality.split(',')}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <SelectFilter
                    id="purpose"
                    isLoading={isLoadingPurposes}
                    label={t('SearchFilters.purposeLabel')}
                    name="app-SearchFilters-purpose-select"
                    onChange={item => this.onFilterChange('purpose', item.value)}
                    options={searchUtils.getPurposeOptions(purposes, intl.locale)}
                    value={filters.purpose}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectFilter
                    id="unit"
                    isLoading={isLoadingUnits}
                    label={t('SearchFilters.unitLabel')}
                    name="app-SearchControls-unit-select"
                    onChange={item => this.onFilterChange('unit', item.value)}
                    options={searchUtils.getUnitOptions(units, intl.locale)}
                    value={filters.unit}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectFilter
                    id="people"
                    label={t('SearchFilters.peopleCapacityLabel')}
                    name="app-SearchFilters-people-select"
                    onChange={item => this.onFilterChange('people', item.value)}
                    options={searchUtils.getPeopleCapacityOptions()}
                    value={Number(get(filters, 'people'))}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <PositionControl
                    geolocated={isGeolocationEnabled}
                    onConfirm={value => this.onFilterChange('distance', value)}
                    onPositionSwitch={() => {
                      if (isGeolocationEnabled) {
                        this.onFilterChange('distance', null);
                      }

                      onGeolocationToggle();
                    }}
                    value={parseInt(filters.distance, 10)}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <TimeRangeFilter
                    label={t('TimeRangeControl.timeRangeTitle')}
                    onChange={value => this.onFilterChange('availableBetween', value)}
                    value={availableBetween}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <ToggleFilter
                    checked={!!get(filters, 'freeOfCharge', false)}
                    id="charge"
                    label={t('SearchFilters.chargeLabel')}
                    onChange={checked => this.onFilterChange('freeOfCharge', checked)}
                  />
                </Col>
              </Row>
            </Panel>
            <Row className="app-SearchFilters__buttons">
              <Col sm={12}>
                <Button
                  bsStyle="primary"
                  className="app-SearchFilters__submit-button"
                  key="submit-button"
                  onClick={() => this.onSearch()}
                  type="submit"
                >
                  {t('SearchFilters.searchButton')}
                </Button>
                {this.hasFilters() && (
                  <Button
                    bsStyle="link"
                    className="app-SearchFilters__reset-button"
                    key="reset-button"
                    onClick={() => this.onReset()}
                  >
                    <img alt="" src={iconTimes} />
                    {t('SearchFilters.resetButton')}
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

const ISearchFilters = injectT(SearchFilters);
export { ISearchFilters };
export default injectIntl(ISearchFilters);
