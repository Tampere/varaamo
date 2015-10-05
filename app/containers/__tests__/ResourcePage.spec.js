import { expect } from 'chai';
import React from 'react';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import { UnconnectedResourcePage as ResourcePage } from 'containers/ResourcePage';
import Resource from 'fixtures/Resource';

describe('Container: ResourcePage', () => {
  const resource = Resource.build();
  const name = resource.name.fi;
  const props = {
    actions: { fetchResource: simple.stub() },
    id: resource.id,
    resource: Immutable(resource),
  };
  let page;

  before(() => {
    page = TestUtils.renderIntoDocument(<ResourcePage {...props} />);
  });

  describe('rendering', () => {
    it('should render without problems', () => {
      expect(page).to.be.ok;
    });

    it('should set a correct page title', () => {
      expect(document.title).to.equal(`${name} - Respa`);
    });

    it('should display resource name inside h1 tags', () => {
      const headerComponent = TestUtils.findRenderedDOMComponentWithTag(page, 'h1');
      const headerDOM = findDOMNode(headerComponent);

      expect(headerDOM.textContent).to.equal(name);
    });
  });

  describe('fetching data', () => {
    it('should fetch resource data when component mounts', () => {
      expect(props.actions.fetchResource.callCount).to.equal(1);
    });
  });
});
