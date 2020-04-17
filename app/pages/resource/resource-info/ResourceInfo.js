import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import injectT from '../../../i18n/injectT';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import ReservationInfo from '../reservation-info/ReservationInfo';
import Equipment from '../resource-equipment/ResourceEquipment';
import ResourcePanel from './ResourcePanel';

function ResourceInfo({
  isLoggedIn, resource, unit, t,
}) {
  const hasProducts = resource.products && resource.products.length > 0;

  return (
    <section className="app-ResourceInfo">
      {resource.description && (
        <ResourcePanel header={t('ResourceInfo.descriptionTitle')}>
          <div className="app-ResourceInfo__description">
            <WrappedText openLinksInNewTab text={resource.description} />
          </div>
        </ResourcePanel>
      )}

      {resource.specificTerms && (
        <ResourcePanel header={t('ResourcePage.specificTerms')}>
          <WrappedText text={resource.specificTerms} />
        </ResourcePanel>
      )}

      {resource.genericTerms && (
        <ResourcePanel defaultExpanded={false} header={t('ResourcePage.genericTermsHeader')}>
          <WrappedText text={resource.genericTerms} />
        </ResourcePanel>
      )}

      {hasProducts && resource.paymentTerms && (
        <ResourcePanel defaultExpanded={false} header={t('paymentTerms.title')}>
          <WrappedText text={resource.paymentTerms} />
        </ResourcePanel>
      )}

      <ResourcePanel header={t('ResourceInfo.additionalInfoTitle')}>
        <Row>
          <Col className="app-ResourceInfo__address" xs={6}>
            {unit && unit.name && <span>{unit.name}</span>}
            {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
            {unit && <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>}
          </Col>
          <Col className="app-ResourceInfo__web" xs={6}>
            {unit && unit.wwwUrl && (
              <span className="app-ResourceInfo__www">
                <a href={unit.wwwUrl} rel="noopener noreferrer" target="_blank">
                  {t('ResourceInfo.serviceWebLink')}
                </a>
              </span>
            )}
          </Col>
        </Row>
      </ResourcePanel>

      { Array.isArray(resource.equipment)
      && resource.equipment.length > 0 && (<Equipment equipment={resource.equipment} />) }

      <ResourcePanel header={t('ResourceInfo.reservationTitle')}>
        <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
      </ResourcePanel>
    </section>
  );
}

ResourceInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
