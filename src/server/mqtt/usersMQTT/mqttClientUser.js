import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    console.log('Connected to MQTT broker from mqttClientUser.js');
});

export default client;
