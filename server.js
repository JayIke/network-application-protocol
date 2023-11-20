const net = require('net');
const { ChatRoomProtocol, MessageType } = require('./protocol');
const os = require('os');

const clients = new Set(); // Set to store connected TCP sockets
const id_list = new Set();
function broadcastToAllClients(message){
  // Iterate through all connected clients and send the message
    for (const c of clients) {
      c.write(message);
  }
}

// Active client information
const Client={
  ID: {
  username: new Set(),
  IP: new Set(),
  socket: new Set(),
  }
}

const server = net.createServer((socket) => {
  
  socket.on('data', (data) => {
    
    const { type, sender, message } = ChatRoomProtocol.parseMessage(data.toString());
    console.log(data.toString());
    console.log(Client.ID.username);
    console.log(Client.ID.IP);
    switch (type) {
      case 'JOIN':
        if (Client.ID.username.size > 0 && Client.ID.username.has(sender)){
          socket.write('Username exists, try different one');
          break;
        } 
        
        socket.username = sender;
        Client.ID.username.add(sender);
        Client.ID.IP.add(socket.localAddress);
        Client.ID.socket.add(socket);
        
        console.log(Client.ID.username);
        clients.add(socket)
        id_list.add(sender);
        console.log('Client IP: ' + socket.localAddress);
       
        const okay = ChatRoomProtocol.createOkayMessage(sender);
        socket.write(okay);
        console.log('Clients set size: ' + clients.size);

        const noti = ChatRoomProtocol.createNotificationMessage(sender, 'entered chat!');
        
        broadcastToAllClients(noti);
        break;

      case 'CHAT':
        
        if (Client.ID.username.has(sender)){
          
          broadcastToAllClients(data.toString());
        } else {
          const invalidUsername = ChatRoomProtocol.createErrorMessage('Server', ChatRoomProtocol.ErrorMessage.NOID);
          socket.write(invalidUsername);
        }
        break;
      
      case 'EERR':
        console.error(`${type}: ${message}`);
        // Handle command logic
        // ...
        break;

      case 'LEAV':
        console.log(`${type}: ${sender}`);
        if(socket.closed){
        const noti = ChatRoomProtocol.createNotificationMessage(socket.username, 'left the chat!');
        broadcastToAllClients(noti);
        } else {
          socket.destroy();
          clients.delete(socket);
          id_list.delete(sender);
          console.log('connection count: ' + clients.size);
        const noti = ChatRoomProtocol.createNotificationMessage(socket.username, 'left the chat!');
        broadcastToAllClients(noti);
        }
        
        console.log('Connection count: ' + clients.size);
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    };
    socket.on('end', () => {
      socket.resetAndDestroy;
      console.log('Client disconnected');
    });
    socket.on('close', () =>{
      console.log('Client closed');
    })
  });
  });

server.on('error', (err) => {
  const eerr = ChatRoomProtocol.createErrorMessage('Server', err)
  socket.write(eerr);
  throw err;
});
server.on('connect', (socket) =>{
  console.log('client trying to connect');
});

server.on('connection', (socket) => {
  console.log('Client connected to TCP server');
});

const PORT = 90;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`, server.address());
  });




