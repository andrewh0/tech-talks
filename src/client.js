// @flow

import App from './components/App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';

const rootElement = document.getElementById('root');
if (rootElement) {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    rootElement
  );
}

// https://medium.com/flow-type/new-flow-errors-on-unknown-property-access-in-conditionals-461da66ea10
// $FlowFixMe
if (module.hot) {
  module.hot.accept();
}
