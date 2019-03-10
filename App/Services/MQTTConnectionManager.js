import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import { EventEmitter } from 'events';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
});

class MQTTConnection {
  static createClientId() {
    return `rn-mqtt-${(Math.random() * 1e9).toString(36)}`;
  }

  event = new EventEmitter();

  onConnect = () => {
    this.event.emit('connect');
    this.subscriptions.forEach(topic =>
      this.client.subscribe(this.addPrefix(topic))
    );
  };

  onConnectionLost = () => {
    this.event.emit('disconnect');
  };

  onMessageArrived = message => {
    const bareTopic = this.removePrefix(message.topic);
    message.bareTopic = bareTopic;
    this.event.emit('message', message);
  };

  constructor({
    hostname,
    port,
    username,
    password,
    deviceId,
    subscriptions,
    path = '',
    useSSL = false
  }) {
    const { onConnectionLost, onMessageArrived, onConnect } = this;
    this.deviceId = deviceId;
    this.username = username;
    this.subscriptions = subscriptions;

    this.client = new Paho.MQTT.Client(
      hostname,
      port,
      path,
      MQTTConnection.createClientId()
    );
    const client = this.client;
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      onSuccess: onConnect,
      useSSL,
      userName: username,
      password,
      reconnect: true
    });
  }

  get topicPrefix() {
    const { username, deviceId } = this;
    return `u/${username}/d/${deviceId}/`;
  }

  addPrefix(topic) {
    return `${this.topicPrefix}${topic}`;
  }

  removePrefix(topic) {
    const pfx = this.topicPrefix;
    if (topic.startsWith(pfx)) {
      return topic.slice(pfx.length);
    } else {
      return topic;
    }
  }

  publish(topic, payload, qos = 0, retained = false) {
    this.client.publish(this.addPrefix(topic), payload, qos, retained);
  }

  destroy() {
    try {
      this.client.disconnect();
    } catch (e) {
      console.log('Already disconnected');
    }
    this.event.removeAllListeners();
  }
}

const addEventListeners = (connMgr, conn, uid) => {
  conn.event.on('message', connMgr._onMessage.bind(connMgr, uid));
  conn.event.on('connect', connMgr._onConnect.bind(connMgr, uid));
  conn.event.on('disconnect', connMgr._onDisconnect.bind(connMgr, uid));
};

export default class MQTTConnectionManager {
  connectionsByUid = {};

  constructor() {}

  _onMessage(uid, message) {
    console.log(
      `_onMessage(${uid}, ${JSON.stringify({
        t: message.topic,
        bt: message.bareTopic,
        p: message.payloadString
      })})`
    );
  }

  _onConnect(uid) {
    console.log(`_onConnect(${uid})`);
  }

  _onDisconnect(uid) {
    console.log(`_onDisconnect(${uid})`);
  }

  subscribe(topics) {
    this.subscriptions = topics;
  }

  publish = (uid, topic, payload, qos = 0, retained = false) => {
    this.connectionsByUid[uid].publish(topic, payload, qos, retained);
  };

  removeConnection(uid) {
    if (!this.connectionsByUid[uid]) {
      return;
    }
    this.connectionsByUid[uid].destroy();
    delete this.connectionsByUid[uid];
  }

  removeAllConnections() {
    for (const uid of Object.keys(this.connectionsByUid)) {
      this.removeConnection(uid);
    }
  }

  resetConnections = connectionsByUid => {
    this.removeAllConnections();
    for (const uid of Object.keys(connectionsByUid)) {
      this.createConnection(uid, connectionsByUid[uid]);
    }
  };

  createConnection(uid, { hostname, port, username, password, deviceId }) {
    if (this.connectionsByUid[uid]) {
      throw new Error(`MQTT client with uid="${uid}" already exists`);
    }

    const connection = new MQTTConnection({
      hostname,
      port,
      username,
      password,
      deviceId,
      subscriptions: this.subscriptions
    });
    this.connectionsByUid[uid] = connection;
    addEventListeners(this, connection, uid);

    console.log(`Created connection ${uid}`, {
      hostname,
      port,
      username,
      deviceId,
      subscriptions: this.subscriptions
    });
  }
}
