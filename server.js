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
    //console.log(data.toString());
    
    const { type, sender, message } = ChatRoomProtocol.parseMessage(data.toString());

    switch (type) {
      case 'JOIN':
        

        //socket.room = roomID;
        clients.add(socket);
        console.log(socket.localAddress);
        broadcastToAllClients(alt.toString());
        socket.username = sender;
        const okay = ChatRoomProtocol.createOkayMessage(sender);
        
        socket.write(okay);
        
        console.log(`@${socket.username} connected.`);
        //socket.write(ChatRoomProtocol.createOkayMessage(`Welcome to the chat, ${socket.username}`));
        console.log('Clients set size: ' + clients.size);
        //console.log(`User joined room ${roomID}: ${message}`);
        // Broadcast join message to all clients
        // ...
        break;

      case 'CHAT':
        console.log('Connection count: ' + clients.size);
        console.log(message);
        
        //const broadcast =  ChatRoomProtocol.createChatMessage('General', message);
        //socket.write(alt.toString());
        socket.write(ChatRoomProtocol.createOkayMessage(alt.toString()));
        broadcastToAllClients(alt.toString());
        // Broadcast chat message to all clients
        // ...
        break;
      case 'OKAY':
        //console.log(`${ type, sender, message }`);
        
        //socket.write(ChatRoomProtocol.createChatMessage('General', message[0], message[1]));
        // Broadcast chat message to all clients
        // ...
  
        break;
      
      case 'EERR':
        console.error(`${type}: ${message}`);
        // Handle command logic
        // ...

        break;

      case 'LEAVE':
        console.log(`${type}: ${message}`);
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
    socket.destroy;
    console.log('Client disconnected');
  });
});

server.on('error', (err) => {
  const eerr = ChatRoomProtocol.createErrorMessage('EERR', 'Server', err)
  socket.write(eerr);
  throw err;
});

const PORT = 90;
  // server.listen()
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} `, server.address());
  });




