// @flow

import {getAllSettings, saveSettings} from './Settings';
import {getCurrentDateDisplay, getCurrentTimeDisplay} from './timeFormatting';
import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';
import {CheckboxGroup, Checkbox} from 'react-checkbox-group';
import styled from 'styled-components';
import {PEOPLE_COLLECTION_ID, PLACES_COLLECTION_ID, THINGS_COLLECTION_ID} from './unsplash';

type Props = {};

type State = {
  collections: Array<string>,
  timeFormat: string,
  showSaveNotice: boolean,
};

const OptionsLabel = styled.label`
  > input {
    margin: 4px;
  }
`;

const SavedNotice = styled.div`
  background: lightgreen;
  border: 1px solid green;
  height: ${props => props.visible ? '25px' : '0'};
  margin-bottom: ${props => props.visible ? '0' : '25px'};
  opacity: ${props => props.visible ? 1 : 0};
  text-align: center;
  transition: opacity 0.5s, height 0.5s, margin-bottom 0.5s;
  width: 100%;
  > span {
    line-height: 25px;
  }
`;

export default class OptionsApp extends React.Component<Props, State> {
  state = {
    collections: [
      PEOPLE_COLLECTION_ID,
      PLACES_COLLECTION_ID,
      THINGS_COLLECTION_ID,
    ],
    timeFormat: 'default',
    showSaveNotice: false,
  };
  _timerID: any = null;

  async componentWillMount() {
    const saved = await getAllSettings();
    if (saved != null) {
      this.setState(saved);
    }
  }

  _onSave = async () => {
    await saveSettings({
      timeFormat: this.state.timeFormat,
      collections: this.state.collections,
    });
    this.setState({
      showSaveNotice: true,
    }, this._setHideTimer);
  };

  _setHideTimer = () => {
    let timerID = this._timerID;
    if (timerID != null) {
      window.clearTimeout(timerID);
    }
    this._timerID = window.setTimeout(this._hideNotice, 4000);
  };

  _hideNotice = () => {
    this.setState({
      showSaveNotice: false,
    });
  };


  render() {
    const {collections, timeFormat, showSaveNotice} = this.state;
    return (
      <form onSubmit={this._onSave}>
        <h3>Preferred Time Format:</h3>
        <RadioGroup name="time" selectedValue={timeFormat} onChange={this._onTimeFormatChange}>
          <OptionsLabel><Radio value="24hr" />24-hour ({getCurrentTimeDisplay(false)})</OptionsLabel><br />
          <OptionsLabel><Radio value="12hr" />12-hour ({getCurrentTimeDisplay(true)})</OptionsLabel><br />
          <OptionsLabel><Radio value="default" />Default</OptionsLabel><br />
        </RadioGroup>
        <hr />
        <h3>Photo Types:</h3>
        What types of pictures do you want to see on your new tab page?<br /><br />
        <CheckboxGroup name="time" value={collections} onChange={this._onCollectionsChange}>
          <OptionsLabel><Checkbox value={PEOPLE_COLLECTION_ID} />People</OptionsLabel><br />
          <OptionsLabel><Checkbox value={PLACES_COLLECTION_ID} />Places</OptionsLabel><br />
          <OptionsLabel><Checkbox value={THINGS_COLLECTION_ID} />Things</OptionsLabel><br />
        </CheckboxGroup>
        <SavedNotice visible={showSaveNotice}>
          <span>{showSaveNotice ? 'Saved!' : ''}</span>
        </SavedNotice>
      </form>
    );
  }

  _onTimeFormatChange = (timeFormat: string) => {
    this.setState({ timeFormat }, this._onSave);
  };

  _onCollectionsChange = (collections: Array<string>) => {
    this.setState({ collections }, this._onSave);
  };
}
