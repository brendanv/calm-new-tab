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
  position: absolute;
  z-index: 0;
`;

const Photo = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export default class BackgroundPhoto extends React.Component<Props> {
  photoNode: ?any = null;

  getPhotoData(): ?PhotoData {
    const img = this.photoNode;
    const canvas = document.createElement('canvas');
    if (
      img == null ||
      canvas == null ||
      !(img instanceof HTMLImageElement)
    ) {
      return null;
    }
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);

    return {
      type: 'local',
      src: canvas.toDataURL('image/png'),
      time: Date.now(),
      ownerName: this.props.photo.ownerName,
      ownerLink: this.props.photo.ownerLink,
    };
  }

  render() {
    const {onImageLoaded, photo: {src}} = this.props;
    return (
      <Wrapper>
        <Photo 
          crossOrigin={this.props.photo.type === 'remote' ? 'anonymous' : undefined}
          innerRef={(elem) => {this.photoNode = elem;}} 
          src={src} 
          onLoad={onImageLoaded} 
        />
      </Wrapper>
    );
  }
};
