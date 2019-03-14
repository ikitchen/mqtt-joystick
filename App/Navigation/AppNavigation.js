import { createStackNavigator, createAppContainer } from 'react-navigation';
import ConnectionEditorScreen from '../Containers/ConnectionEditorScreen';
import ControlScreen from '../Containers/ControlScreen';
import LaunchScreen from '../Containers/LaunchScreen';

import styles from './Styles/NavigationStyles';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    ConnectionEditorScreen: {
      screen: ConnectionEditorScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    LaunchScreen: {
      screen: LaunchScreen,
      navigationOptions: () => ({
        title: 'Home'
      })
    },
    ControlScreen: { screen: ControlScreen }
  },
  {
    // Default config for all screens
    headerMode: 'float',

    initialRouteName: 'LaunchScreen',
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

export default createAppContainer(PrimaryNav);
