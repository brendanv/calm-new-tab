// @flow

import App from './App';
import React from 'react';
import {render} from 'react-dom';

const container = document.getElementById('react-container');
if (container != null) {
  render(<App />, container);
}
