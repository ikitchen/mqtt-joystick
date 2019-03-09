import { AsyncStorage } from 'react-native';

const CONNECTIONS = 'connections';

export const saveConnections = async connections => {
  const serializedConnections = JSON.stringify(connections);
  await AsyncStorage.setItem(CONNECTIONS, serializedConnections);
};

export const loadConnections = async () => {
  const serializedConnections = await AsyncStorage.getItem(CONNECTIONS);

  if (!serializedConnections) {
    return {};
  }
  try {
    return JSON.parse(serializedConnections);
  } catch (e) {
    return {};
  }
};
