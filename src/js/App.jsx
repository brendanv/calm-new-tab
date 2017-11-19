// @flow

import type {PhotoData} from './unsplash';

import Attribution from './Attribution';
import BackgroundPhoto from './BackgroundPhoto';
import React from 'react';
import styled from 'styled-components';
import Time from './Time';

import {getPhotoDataFromCache, saveToCache} from './cachingShared';
import {getRandomPhoto} from './unsplash';

type Props = {
  photoData: ?PhotoData,
  visible: boolean,
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s;
  font-size: 14px;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoData: null,
      visible: false,
    };
  }

  async componentDidMount() {
    let photoData = await getPhotoDataFromCache();
    if (photoData == null) {
      photoData = await getRandomPhoto();
      if (photoData != null) {
        this.setState({ photoData });
      }
    } else {
      this.setState({ photoData });
    }
  }

  onImageLoaded = () => {
    this.setState({ visible: true }, this._onCacheImage);
  };

  _onCacheImage = () => {
    const {photoData} = this.state;
    if (photoData == null) {
      return;
    }
    saveToCache(photoData);
  }

  render() {
    const {photoData, visible} = this.state;
    if (photoData == null) {
      return null;
    }
    return (
      <Wrapper visible={visible}>
        <BackgroundPhoto onImageLoaded={this.onImageLoaded} photo={photoData} />
        <Time />
        <Attribution photo={photoData} />
      </Wrapper>
    );
  }
}
