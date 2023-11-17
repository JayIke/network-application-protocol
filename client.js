const net = require('net');
const readline = require('readline');
const { ChatRoomProtocol } = require('./protocol');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const client = new net.Socket();


rl.question('Enter your username: ', (username) => {
  client.username = username;
  client.connect(90, '172.17.67.6', () => {
    console.log('Connected to server!');
    const joinMessage = ChatRoomProtocol.createJoinMessage('General', username);
    client.write(joinMessage);
    console.log('Join message sent.');
  
  });
  
});

client.on('data', (data) => {
  const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

  switch (type) {
    case 'CHAT':
      console.log(message.sender + message.message);
      break;

    case 'NOTIFICATION':
      console.log(`[${roomID}] Notification: ${message}`);
      break;

    case 'ERROR':
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
  console.error(err);
  rl.close();
});

rl.on('line', (input) => {

  const chatMessage = ChatRoomProtocol.createChatMessage('General', client.username, input);

  client.write(chatMessage);
});
