const net = require('net');
const { ChatRoomProtocol, MessageType } = require('./protocol');
const os = require('os');
//const http = require('http');
//const express = require('express');

//const app = express();
//const webServer = http.createServer(app);
const clients = new Set(); // Set to store connected TCP sockets
function broadcastToAllClients(message) {
  // Iterate through all connected clients and send the message
    for (const c of clients) {
      c.write(message);
    }
  }

const server = net.createServer((socket) => {
  
  socket.on('data', (data) => {
    let alt = data;
    console.log(data.toString());
    
    const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

    switch (type) {
      case 'JOIN':
      socket.username = message;
      socket.room = roomID;
      clients.add(socket);
      broadcastToAllClients('JOIN ' + socket.username);
        console.log(`@${socket.username} connected.`);
        socket.write(ChatRoomProtocol.createChatMessage('General', 'Server:', message));
        console.log('Clients set size: ' + clients.size)
        //console.log(`User joined room ${roomID}: ${message}`);
        // Broadcast join message to all clients
        // ...


        break;

      case 'CHAT':
        console.log('Connection count: ' + clients.size);
        console.log(message);
        
        //const broadcast =  ChatRoomProtocol.createChatMessage('General', message);
        //socket.write(alt.toString());
        broadcastToAllClients(alt.toString());
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
 
  server.on('connection', (socket) => {
    //clients.add(socket);
    console.log('Client connected to TCP server');
  });

  socket.on('end', () => {
    clients.delete(socket);
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




