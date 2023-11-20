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

    switch (type) {
      case 'JOIN':
        
       
        //clients.add(socket);
        if (id_list.has(sender)){
          socket.write('Username exists, try different one');
          break;
        } 
        Client.ID.username.add(sender);
        Client.ID.IP.add(socket.localAddress);
        Client.ID.socket.add(socket);
        //socket.username = sender;
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
        console.log('Connection count: ' + clients.size);
        if (Client.ID.username.has(sender)){
          const chat = ChatRoomProtocol.createChatMessage(sender,message);
          broadcastToAllClients(chat);
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
        const noti = ChatRoomProtocol.createNotificationMessage(sender, 'left the chat!');
        broadcastToAllClients(noti);
        } else {
          socket.destroy();
          clients.delete(socket);
          id_list.delete(sender);
          console.log('connection count: ' + clients.size);
        const noti = ChatRoomProtocol.createNotificationMessage(sender, 'left the chat!');
        broadcastToAllClients(noti);
        }
        
    
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    };
    socket.on('end', () => {
      //clients.delete(socket);
      //id_list.delete(socket.username);
      socket.destroy;
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
  //clients.add(socket);
  //id_list.add(socket.username);
  //console.log(socket.username);
  console.log('Client connected to TCP server');
});
const PORT = 90;
  // server.listen()
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`, server.address());
  });




