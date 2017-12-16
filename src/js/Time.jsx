// @flow

import {Overlay, OverlayText} from './UtilComponents';
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
  text-align: center;
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
    const currTime = new Date().toLocaleString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    if (currTime !== timeDisplay) {
      const dateDisplay = new Date().toLocaleString(navigator.language, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      this.setState({
        dateDisplay,
        timeDisplay: currTime,
      });
    }
  };
}
