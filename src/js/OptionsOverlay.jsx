// @flow

import {Overlay, OverlayText} from './UtilComponents';
import React from 'react';
import styled from 'styled-components';

function openOptions() {
  chrome.runtime.openOptionsPage();
}

const OptionsOverlay = Overlay.withComponent('div').extend`
  position: absolute;
  right: 15px;
  top: 15px;
  text-align: right;
`;

const Options = () => {
  return (
    <OptionsOverlay>
      <OverlayText>
        <a onClick={openOptions} href="#">Settings</a>
      </OverlayText>
    </OptionsOverlay>
  );
};

export default Options;
