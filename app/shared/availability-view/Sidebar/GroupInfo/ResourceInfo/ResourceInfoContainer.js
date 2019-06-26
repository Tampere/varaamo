import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

import UnpublishedLabel from 'shared/label/Unpublished';
import { injectT } from 'i18n';
import { resourcesSelector } from 'state/selectors/dataSelectors';

ResourceInfo.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  peopleCapacity: PropTypes.number,
  public: PropTypes.bool.isRequired,
};
export function ResourceInfo(props) {
  return (
    <div
      className={classNames('resource-info', { 'resource-info-selected': props.isSelected })}
      title={props.name}
    >
      <div className="name">
        <Link to={`/resources/${props.id}?date=${props.date}`}>{props.name}</Link>
      </div>
      <div className="details">
        <Glyphicon glyph="user" />
        {' '}
        {props.peopleCapacity}
        {!props.public && (
          <UnpublishedLabel />
        )}
      </div>
    </div>
  );
}

export function selector() {
  function idSelector(state, props) {
    return props.id;
  }
  const resourceSelector = createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id]
  );
  return createSelector(
    resourceSelector,
    resource => ({
      name: resource.name,
      peopleCapacity: resource.peopleCapacity,
      public: resource.public,
    })
  );
}

export const UnconnectedResourceInfo = injectT(ResourceInfo);

const ResourceInfoContainer = connect(selector)(UnconnectedResourceInfo);
ResourceInfoContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
export default ResourceInfoContainer;
