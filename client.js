// client.js
const net = require('net');

const client = net.createConnection({ port: 8124 }, () => {
    console.log('Connected to server!');
    client.write('Hello from client!\r\n');
});

client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});

client.on('error', (err) => {
    console.error(err);
});
//test