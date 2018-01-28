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

const Notification = styled.div`
  position: absolute;
  top: -2px;
  left: -10px;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  box-shadow: 0 0 10px black;
`;

const Options = (props: {showNotif: boolean}) => {
  const notif = props.showNotif ? <Notification /> : null;
  return (
    <OptionsOverlay>
      <OverlayText>
        <a onClick={openOptions} href="#">
          Settings
          {notif}
        </a>
      </OverlayText>
    </OptionsOverlay>
  );
};

export default Options;
