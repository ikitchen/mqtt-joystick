import React, { Component } from 'react';
import { ScrollView, Text, Image, View } from 'react-native';
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js';
import { NavigationActions } from 'react-navigation';
import { Button } from 'react-native';
import { Images } from '../Themes';
import { connectionsManager } from '../Services/MQTT';

// Styles
import styles from './Styles/LaunchScreenStyles';
import Joystick from '../Components/Joystick.js';

export default class LaunchScreen extends Component {
  onJoystickChange = ({ sector, side }) => {
    console.log('onJoystickChange', { sector, side });
    connectionsManager.publish('default', 'direction', side || '0', 2);
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Button
          title="Control"
          onPress={() =>
            this.props.navigation.navigate({ routeName: 'ControlScreen' })
          }
        />
        <Joystick onChange={this.onJoystickChange} />
      </View>
    );
  }
}
