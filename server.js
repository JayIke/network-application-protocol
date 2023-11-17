// server.js
const net = require('net');
const { ChatRoomProtocol, MessageType } = require('./protocol');

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

    switch (type) {
      case MessageType.JOIN:
        console.log(`User joined room ${roomID}: ${message}`);
        // Handle user joining logic
        break;

      case MessageType.CHAT:
        console.log(`Chat message in room ${roomID} from ${message}`);
        // Handle chat message logic
        break;

      case MessageType.CMD:
        console.log(`Command received in room ${roomID}: ${message}`);
        // Handle command logic
        break;

      case MessageType.LEAVE:
        console.log(`User left room ${roomID}: ${message}`);
        // Handle user leaving logic
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Example: Sending a welcome message to the client
  const welcomeMessage = ChatRoomProtocol.createChatMessage('General', 'Server', 'Welcome to the chat room!');
  socket.write(welcomeMessage);
});

server.on('error', (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log('Server listening on port 8124');
});

// // server.js
// const net = require('net');

// const server = net.createServer((socket) => {
//     console.log('Client connected');

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });

//     socket.write('Hello from server!\r\n');
//     socket.pipe(socket);
// });

// server.on('error', (err) => {
//     throw err;
// });

// server.listen(8124, () => {
//     console.log('Server listening on port 8124');
// });
