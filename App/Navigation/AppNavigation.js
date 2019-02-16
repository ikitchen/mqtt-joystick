import { createStackNavigator, createAppContainer } from 'react-navigation';
import ControlScreen from '../Containers/ControlScreen';
import LaunchScreen from '../Containers/LaunchScreen';

import styles from './Styles/NavigationStyles';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
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
