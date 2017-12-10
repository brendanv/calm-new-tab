// @flow

import type {PhotoData} from './unsplash';

import {Overlay, OverlayText} from './UtilComponents';
import React from 'react';
import styled from 'styled-components';
import {utmify} from './unsplash';

type Props = {
  photo: PhotoData,
};

const AttributionOverlay = Overlay.withComponent('div').extend`
  position: absolute;
  right: 15px;
  bottom: 15px;
  text-align: right;
`;

const Attribution = (props: Props) => {
  const {photo: {location, ownerName, ownerLink}} = props;
  return (
    <AttributionOverlay>
      <OverlayText>
        {location}{location == null ? null : <br />}
        Photo by <a href={utmify(ownerLink)} target="_blank">{ownerName}</a>{' / '}
        <a href={utmify('https://unsplash.com')} target="_blank">Unsplash</a>
      </OverlayText>
    </AttributionOverlay>
  );
};

export default Attribution;
