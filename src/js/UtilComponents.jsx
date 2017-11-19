// @flow

import styled from 'styled-components';

const Overlay = styled.span`
  z-index: 1;
`;

const OverlayText = Overlay.extend`
  color: white;
  text-decoration: none;
  text-shadow: 0 0 10px black;
  font-size: ${props => props.fontSize};
`;

export {
  Overlay,
  OverlayText,
};
