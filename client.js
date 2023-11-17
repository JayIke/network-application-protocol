const net = require('net');
const readline = require('readline');
const { ChatRoomProtocol } = require('./protocol');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();

client.connect(3000, 'localhost', () => {
  console.log('Connected to server!');
  rl.question('Enter your username: ', (username) => {
    const joinMessage = ChatRoomProtocol.createJoinMessage('General', username);
    client.write(joinMessage);
  });
});

client.on('data', (data) => {
  const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

  switch (type) {
    case ChatRoomProtocol.MessageType.CHAT:
      console.log(`[${roomID}] ${message}`);
      break;

    case ChatRoomProtocol.MessageType.NOTIFICATION:
      console.log(`[${roomID}] Notification: ${message}`);
      break;

    case ChatRoomProtocol.MessageType.ERROR:
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
  const chatMessage = ChatRoomProtocol.createChatMessage('General', 'Me', input);
  client.write(chatMessage);
});
