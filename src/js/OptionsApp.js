// @flow

import {getAllSettings, saveSettings} from './Settings';
import {getCurrentDateDisplay, getCurrentTimeDisplay} from './timeFormatting';
import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';

type Props = {};

type State = {
  timeFormat: string,
};

export default class OptionsApp extends React.Component<{}> {
  state = {
    timeFormat: 'default',
  };

  async componentWillMount() {
    const saved = await getAllSettings();
    if (saved != null) {
      this.setState(saved);
    }
  }

  _onSave = (event) => {
    saveSettings(this.state);
    event.preventDefault();
  };

  render() {
    const {timeFormat} = this.state;
    return (
      <form onSubmit={this._onSave}>
        Preferred Time Format:
        <RadioGroup name="time" selectedValue={timeFormat} onChange={this._onTimeFormatChange}>
          <label><Radio value="24hr" />24-hour ({getCurrentTimeDisplay(false)})</label><br />
          <label><Radio value="12hr" />12-hour ({getCurrentTimeDisplay(true)})</label><br />
          <label><Radio value="default" />Default</label><br />
        </RadioGroup>
        <br />
        <input type="submit" value="Save" />
      </form>
    );
  }

  _onTimeFormatChange = (timeFormat: string) => {
    this.setState({ timeFormat });
  };
}
