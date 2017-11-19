// @flow

import type {PhotoData} from './unsplash';

import React from 'react';
import styled from 'styled-components';

type Props = {
  photo: PhotoData,
  onImageLoaded: () => void,
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 0;
`;

const Photo = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const BackgroundPhoto = (props: Props) => {
  const {onImageLoaded, photo: {src}} = props;
  return (
    <Wrapper>
      <Photo src={src} onLoad={onImageLoaded} />
    </Wrapper>
  );
};

export default BackgroundPhoto;
