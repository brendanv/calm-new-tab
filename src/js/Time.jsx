// @flow

import {getCurrentDateDisplay, getCurrentTimeDisplay} from './timeFormatting';
import {Overlay, OverlayText} from './UtilComponents';
import React from 'react';
import styled from 'styled-components';

type Props = {
  timeFormat?: ?string,
};

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

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.timeFormat !== this.props.timeFormat) {
      this._updateTimer(nextProps);
    }
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

  _updateTimer = (props?: Props) => {
    const {timeDisplay} = this.state;
    const {timeFormat} = props || this.props;
    let hour12 = undefined;
    if (timeFormat === '12hr') {
      hour12 = true;
    } else if (timeFormat === '24hr') {
      hour12 = false;
    }
    const currTime = getCurrentTimeDisplay(hour12);
    if (currTime !== timeDisplay) {
      this.setState({
        dateDisplay: getCurrentDateDisplay(),
        timeDisplay: currTime,
      });
    }
  };
}
