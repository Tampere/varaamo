import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceMapInfo from '../ResourceMapInfo';

describe('pages/resource/resource-map-info/ResourceMapInfo', () => {
  const defaultProps = {
    resource: Immutable(Resource.build()),
    unit: Immutable(
      Unit.build({
        addressZip: '12345',
        id: 'aaa:123',
        municipality: 'some city',
        streetAddress: 'Street address 123',
      }),
    ),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceMapInfo {...defaultProps} {...props} />);
  }

  test('renders address text', () => {
    const { addressZip, streetAddress } = defaultProps.unit;
    const resource = Immutable(Resource.build({ distance: 11500 }));
    const expected = `${streetAddress}, ${addressZip} Some city`;
    const span = getWrapper({ resource }).find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toBe(expected);
  });
});
