// @flow

import {Overlay, OverlayText} from './UtilComponents';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

type Props = {};

type State = {
  timeDisplay: ?string,
  dateDisplay: ?string,
};

const TimeOverlay = Overlay.withComponent('div').extend`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TimeContainer = Overlay.withComponent('div').extend`
  padding-bottom: 10vh;
`;

export default class Time extends React.Component<Props, State> {
  _subscription: ?any;
  constructor(props: Props) {
    super(props);
    this.state = {
      timeDisplay: null,
      dateDisplay: null,
    };
  }

  componentDidMount() {
    this._updateTimer();
    this._subscription = setInterval(this._updateTimer, 1000);
  }

  render() {
    const {timeDisplay, dateDisplay} = this.state;
    return (
      <TimeOverlay>
        <TimeContainer>
          <OverlayText fontSize="10em">{timeDisplay}</OverlayText><br />
          <OverlayText fontSize="2.5em">{dateDisplay}</OverlayText>
        </TimeContainer>
      </TimeOverlay>
    );
  }

  _updateTimer = () => {
    const {timeDisplay} = this.state;
    const currTime = moment().format('HH:mm');
    if (currTime !== timeDisplay) {
      // We want something similar to LLLL, but without the time.
      const dateDisplay = moment().format(
        moment.localeData().longDateFormat('LLLL').replace(
          // Remove everything except for: day of week, date, month name, commas
          /[^dDo,M\s]/g,
          '',
        ).replace(
          // Trim any duplicate whitespace into a single space
          /\s+/g,
          ' ',
        ).replace(
          // Trim trailing whitespace or comma characters
          /[\s,]+$/,
          ''
        ),
      );

      this.setState({
        dateDisplay,
        timeDisplay: currTime,
      });
    }
  };
}
