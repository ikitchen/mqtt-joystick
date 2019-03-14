import React, { Component } from 'react';
import { View } from 'react-native';
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js';
import { NavigationActions } from 'react-navigation';
import { Images } from '../Themes';
import { connectionsManager } from '../Services/MQTT';
import Joystick from '../Components/Joystick.js';
import styles from './Styles/LaunchScreenStyles';
import { Header, Right, Button, Text } from 'native-base';

export default class LaunchScreen extends Component {
  onJoystickChange = ({ sector, side }) => {
    console.log('onJoystickChange', { sector, side });
    connectionsManager.publish('default', 'direction', side || '0', 2);
  };

  handleEdit = () => {
    this.props.navigation.navigate('ConnectionEditorScreen');
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Header>
          <Right>
            <Button onPress={this.handleEdit}>
              <Text>Edit</Text>
            </Button>
          </Right>
        </Header>

        <Joystick onChange={this.onJoystickChange} />
      </View>
    );
  }
}
