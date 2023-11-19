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
        //socket.username = sender;
        console.log(sender + 'from join');
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
        if (id_list.has(this.sender)){
          
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
        const noti = ChatRoomProtocol.createNotificationMessage(sender, 'LEFT!');
        broadcastToAllClients(noti);
        } else {
          socket.destroy();
        const noti = ChatRoomProtocol.createNotificationMessage(sender, 'LEFT!');
        broadcastToAllClients(noti);
        }
        
    
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    }
  });
  socket.on('connect', (socket) => {
    const msg = socket.username;
    console.log(msg + ' connected');
  });

  socket.on('end', () => {
    //clients.delete(socket);
    //id_list.delete(socket.username);
    //socket.destroy;
    console.log('Client disconnected');
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
  id_list.add(socket.username);
  console.log(socket.username);
  console.log('Client connected to TCP server');
});
const PORT = 90;
  // server.listen()
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`, server.address());
  });




