const net = require('net');
const { ChatRoomProtocol, MessageType } = require('./protocol');

const server = net.createServer((socket) => {
  
  socket.on('data', (data) => {
    
    const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

    switch (type) {
      case 'JOIN':
        socket.username = message;
        socket.room = roomID;
        console.log('Client connected');
        console.log()
        socket.write(ChatRoomProtocol.createChatMessage('General', 'Server:', message));
        console.log(`User joined room ${roomID}: ${message}`);
        // Broadcast join message to all clients
        // ...


        break;

      case 'CHAT':
        console.log(message);
        
        socket.write(ChatRoomProtocol.createChatMessage('General', socket.username, message));
        // Broadcast chat message to all clients
        // ...

        break;

      case 'NOTIFICATION':
        console.log(`Chat message in room ${roomID} from ${message}`);
        //socket.write(ChatRoomProtocol.createChatMessage('General', message[0], message[1]));
        // Broadcast chat message to all clients
        // ...

        break;
      case 'CMD':
        console.log(`Command received in room ${roomID}: ${message}`);
        // Handle command logic
        // ...

        break;

      case 'LEAVE':
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

const PORT = 90;
// server.listen()
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
