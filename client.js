const net = require('net');
const readline = require('readline');
const { ChatRoomProtocol } = require('./protocol');
const os = require('os');
var me;

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (info.family === 'IPv4' && !info.internal) {
        return info.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if no valid IP address is found
}

// Usage in your code
const ipAddress = getLocalIpAddress();
const port = 90;
const serverAddress = `${ipAddress}:${port}`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const client = new net.Socket();
client.ipAddress = ipAddress;
client.port = port;
client.serverAddress = serverAddress;

rl.question('Enter username: ', (username) => {
  
  client.username = username;
  client.connect(port, ipAddress, () => {
   
    console.log('Connected to server on ' + serverAddress);
    console.log('My address: ' + client.ipAddress);
    const joinMessage = ChatRoomProtocol.createJoinRequest(username);
    client.write(joinMessage);
    console.log('Join message sent.');
  
  });
  
});

client.on('data', (data) => {
  //console.log(data.toString());
  const { type, sender, message } = ChatRoomProtocol.parseMessage(data.toString());
  
  switch (type) {
    case 'OKAY':
      console.log({ type, sender, message });
      break;

    case 'CHAT':
      console.log(`${sender}: ${message}`);
      break;

    case 'NOTI':
      console.log(data.toString());
      break;

    case 'EERR':
      console.error(`Error: ${message}`);
    
      break;

    default:
      console.log(`Unknown message type: ${type}`);
  }
});

client.on('end', (s) => {
  console.log('Disconnected from server');
  try{
    if (!client.isConnected){
      client.connect(port,ipAddress);
    }
  }catch {
    console.log(s);
  rl.close();
  }
});

client.on('error', (err) => {
  const errorMessage = ChatRoomProtocol.createErrorMessage(client.username, err);
  console.error(err);
  client.write(errorMessage);
  console.log('Connection closed by server...');
  console.log('Attempting reconnection...');
  
  client.connect(port,ipAddress, ()=>{
    console.log('Reconnection successful!');
  });
  
  rl.close();
});

rl.on('line', (input)=>{
  if (input == 'LEAV'){
    const leav = ChatRoomProtocol.createLeaveMessage(client.username);
    client.write(leav);
  } else {
    const chat = ChatRoomProtocol.createChatMessage(client.username,input);
    client.write(chat);
  }
});



