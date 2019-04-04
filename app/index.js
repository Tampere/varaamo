import 'location-origin';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import 'assets/styles/main.scss';
import 'assets/styles/customization/espoo/customization.scss';
import 'assets/styles/customization/vantaa/customization.scss';
import { initI18n } from 'i18n';
import configureStore from 'store/configureStore';
import rootReducer from 'state/rootReducer';
import getRoutes from './routes';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
const finalState = Immutable(initialStoreState).merge([initialServerState, initialIntlState], {
  deep: true,
});
const store = configureStore(finalState);

render(
  <Provider store={store}>
    <Router>{getRoutes()}</Router>
  </Provider>,
  document.getElementById('root')
);
