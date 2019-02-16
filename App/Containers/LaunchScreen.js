import React, { Component } from 'react';
import { ScrollView, Text, Image, View } from 'react-native';
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js';
import { NavigationActions } from 'react-navigation';
import { Button } from 'react-native';

import { Images } from '../Themes';

// Styles
import styles from './Styles/LaunchScreenStyles';
import Joystick from '../Components/Joystick.js';

export default class LaunchScreen extends Component {
  onJoystickChange = ({ sector, side }) => {
    console.log('onJoystickChange', { sector, side });
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
        {/* <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship. For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
            </Text>
          </View>

          <DevscreensButton />
        </ScrollView> */}
      </View>
    );
  }
}
