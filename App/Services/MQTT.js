import MQTTConnectionManager from './MQTTConnectionManager';

export const connectionsManager = new MQTTConnectionManager();
connectionsManager.subscribe(['light']);
