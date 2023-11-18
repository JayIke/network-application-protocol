const net = require('net');
const readline = require('readline');
const { ChatRoomProtocol } = require('./protocol');
const os = require('os');

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

rl.question('Enter the JOIN command', (username) => {
  client.username = username;
  client.connect(port, ipAddress, () => {
   
    console.log('Connected to server on ' + serverAddress);
    const joinMessage = ChatRoomProtocol.createJoinMessage('General', username);
    client.write(joinMessage);
    console.log('Join message sent.');
  
  });
  
});

client.on('data', (data) => {
  //console.log(data.toString());
  const { type, sender, message } = ChatRoomProtocol.parseMessage(data.toString());

  switch (type) {
    case 'CHAT':
      console.log(`[${type}] ${sender}: ${message}`);
      break;

    case 'NOTI':
      console.log(`[${type}] Notification: ${sender} ${message}`);
      break;

    case 'EERR':
      console.error(`Error: ${message}`);
      break;

    default:
      console.log(`Unknown message type: ${type}`);
  }
});

client.on('end', () => {
  console.log('Disconnected from server');
  rl.close();
});

client.on('error', (err) => {
  const errorMessage = ChatRoomProtocol.createJoinMessage('EERR', client.username, err);
  console.error(err);
  client.write(errorMessage);
  const leavMessage = ChatRoomProtocol.createLeaveMessage('LEAV', client.username);
  rl.close();
});

rl.on('line', (input) => {

  const chatMessage = ChatRoomProtocol.createChatMessage('General', client.username, input);

  client.write(chatMessage);
});

