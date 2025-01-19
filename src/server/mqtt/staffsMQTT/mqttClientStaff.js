import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    console.log('Connected to MQTT broker from mqttClientStaff.js');
});

export default client;