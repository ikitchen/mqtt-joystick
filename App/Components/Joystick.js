import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './Styles/JoystickStyle';
import { PanResponder } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import _ from 'lodash';

const threshold = 50;
const knobRadius = 30;
const circleRadius = threshold + knobRadius;

const sides = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];

const sectorToSide = sector => (sector === null ? null : sides[sector]);

const angleToSector = angle => Math.floor(norm(angle + 45 / 2) / 45);

const norm = angle => {
  angle = angle % 360;

  if (angle < 0) {
    angle += 360;
  }
  return angle;
};
const vectorAngle = (dx, dy) => norm(Math.atan2(-dy, dx) * (180 / Math.PI));
const vectorLength = (dx, dy) => Math.sqrt(dx * dx + dy * dy);

export default class Joystick extends Component {
  currentSector = null;
  state = {
    circleX: 0,
    circleY: 0,
    circleVisible: false,
    knobX: 0,
    knobY: 0,
    knobHighlighted: false
  };

  setSector(sector) {
    if (sector !== this.currentSector) {
      this.currentSector = sector;
      this.props.onChange &&
        this.props.onChange({ sector, side: sectorToSide(sector) });
    }
    if (sector !== null) {
      this.setKnobHighlighted(true);
    } else {
      this.setKnobHighlighted(false);
    }
  }

  showCircle(x, y) {
    this.setState({
      circleX: x,
      circleY: y,
      circleVisible: true
    });
  }

  moveKnob = _.throttle((x, y) => {
    this.setState({
      knobX: x,
      knobY: y
    });
  }, 30);

  setKnobHighlighted(value) {
    this.setState({
      knobHighlighted: !!value
    });
  }

  hideCircle() {
    this.setState({
      circleVisible: false
    });
  }

  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderStart: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        this.showCircle(locationX, locationY);
        this.moveKnob(locationX, locationY);
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const { locationX, locationY } = evt.nativeEvent;
        const angle = vectorAngle(dx, dy);
        const length = vectorLength(dx, dy);
        const sector = length >= threshold ? angleToSector(angle) : null;
        this.setSector(sector);
        this.moveKnob(locationX, locationY);
      },

      onPanResponderEnd: (evt, gestureState) => {
        this.setSector(null);
        this.hideCircle();
      }
    });
  }

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <Svg width="100%" height="100%">
          {this.state.circleVisible ? (
            <>
              <Circle
                cx={this.state.circleX}
                cy={this.state.circleY}
                r={circleRadius}
                strokeWidth="2.5"
                stroke="rgba(255, 255, 255, 0.5)"
                fill="rgba(255, 255, 255, 0.2)"
              />
              <Circle
                cx={this.state.knobX}
                cy={this.state.knobY}
                r={knobRadius}
                strokeWidth="2.5"
                stroke={
                  this.state.knobHighlighted
                    ? 'rgba(120, 255, 120, 0.9)'
                    : 'rgba(255, 255, 255, 0.5)'
                }
                fill={
                  this.state.knobHighlighted
                    ? 'rgba(120, 255, 120, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)'
                }
              />
            </>
          ) : null}
        </Svg>
      </View>
    );
  }
}
