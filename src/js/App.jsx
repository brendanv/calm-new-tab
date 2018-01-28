// @flow

import type {PhotoData} from './unsplash';

import Attribution from './Attribution';
import BackgroundPhoto from './BackgroundPhoto';
import OptionsOverlay from './OptionsOverlay';
import React from 'react';
import styled from 'styled-components';
import Time from './Time';

import {getPhotoDataFromCache, saveToCache} from './cachingShared';
import {getRandomPhoto} from './unsplash';
import {getAllSettings, SETTINGS_VERSION} from './Settings';

type Props = {};

type State = {
  photoData: ?PhotoData,
  timeFormat: ?string,
  settingsLoaded: boolean,
  showSettingsNotif: boolean,
  imageLoaded: boolean,
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

const CACHE_TTL = 8 * 60 * 60 * 1000;

export default class App extends React.Component<Props, State> {
  photoNode: ?any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      photoData: null,
      timeFormat: null,
      settingsLoaded: false,
      showSettingsNotif: false,
      imageLoaded: false,
    };
  }

  async componentWillMount() {
    const {timeFormat, VERSION: settingsVersion} = await getAllSettings();
    const newState = ({
      settingsLoaded: true,
      showSettingsNotif: settingsVersion == null || settingsVersion < SETTINGS_VERSION,
    }: {[key: string]: any});
    switch (timeFormat) {
      case '24hr':
        newState.timeFormat = '24hr';
        break;
      case '12hr':
        newState.timeFormat = '12hr';
        break;
      case 'default':
      default:
        newState.timeFormat = 'default';
        break;
    }
    this.setState(newState);
  }

  async componentDidMount() {
    let photoData = await getPhotoDataFromCache();
    if (photoData == null || (Date.now() - photoData.time) > CACHE_TTL) {
      photoData = await getRandomPhoto();
      if (photoData != null) {
        this.setState({ photoData });
      }
    } else {
      this.setState({ photoData });
    }
  }

  onImageLoaded = () => {
    this.setState({ imageLoaded: true }, this._onCacheImage);
  };

  _onCacheImage = () => {
    const {photoData} = this.state;
    const node = this.photoNode;
    if (photoData != null && photoData.type === 'remote' && node != null) {
      const newData = node.getPhotoData();
      if (newData != null) {
        saveToCache(newData)
          .catch(e => saveToCache(photoData));
      } else {
        saveToCache(photoData);
      }
    }
  }

  render() {
    const {
      imageLoaded,
      photoData,
      settingsLoaded,
      showSettingsNotif,
      timeFormat,
    } = this.state;
    if (photoData == null) {
      return null;
    }
    return (
      <Wrapper visible={imageLoaded && settingsLoaded}>
        <BackgroundPhoto
          ref={(elem) => {this.photoNode = elem;}}
          onImageLoaded={this.onImageLoaded}
          photo={photoData}
        />
        <Time timeFormat={timeFormat} />
        <Attribution photo={photoData} />
        <OptionsOverlay showNotif={showSettingsNotif} />
      </Wrapper>
    );
  }
}
