// @flow

import OptionsApp from './OptionsApp';
import React from 'react';
import {render} from 'react-dom';

const container = document.getElementById('react-container');
if (container != null) {
  render(<OptionsApp />, container);
}
