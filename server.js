const net = require('net');
const { ChatRoomProtocol, MessageType } = require('./protocol');

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.write(ChatRoomProtocol.createChatMessage('General', 'Server', 'Welcome to the chat room!'));

  socket.on('data', (data) => {
    const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

    switch (type) {
      case MessageType.JOIN:
        console.log(`User joined room ${roomID}: ${message}`);
        // Broadcast join message to all clients
        // ...

        break;

      case MessageType.CHAT:
        console.log(`Chat message in room ${roomID} from ${message}`);
        // Broadcast chat message to all clients
        // ...

        break;

      case MessageType.CMD:
        console.log(`Command received in room ${roomID}: ${message}`);
        // Handle command logic
        // ...

        break;

      case MessageType.LEAVE:
        console.log(`User left room ${roomID}: ${message}`);
        // Broadcast leave message to all clients
        // ...

        break;

      default:
        console.log(`Unknown message type: ${type}`);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.on('error', (err) => {
  throw err;
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
