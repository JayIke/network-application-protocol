// server.js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.write('Hello from server!\r\n');
    socket.pipe(socket);
});

server.on('error', (err) => {
    throw err;
});

server.listen(8124, () => {
    console.log('Server listening on port 8124');
});
