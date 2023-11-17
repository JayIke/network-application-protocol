// client.js
const net = require('net');
const readline = require('readline');
const { ChatRoomProtocol } = require('./protocol');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 8124 }, () => {
  console.log('Connected to server!');
  rl.question('Enter your username: ', (username) => {
    const joinMessage = ChatRoomProtocol.createJoinMessage('General', username);
    client.write(joinMessage);
  });
});

client.on('data', (data) => {
  const { type, roomID, data: message } = ChatRoomProtocol.parseMessage(data.toString());

  switch (type) {
    case 'CHAT':
      console.log(`[${roomID}] ${message}`);
      break;

    case 'NOTE':
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
  // Handle user input (e.g., sending chat messages or commands)
  const chatMessage = ChatRoomProtocol.createChatMessage('General', 'Me', input);
  client.write(chatMessage);
});

// // client.js
// const net = require('net');

// const client = net.createConnection({ port: 8124 }, () => {
//     console.log('Connected to server!');
//     client.write('Hello from client!\r\n');
// });

// client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
// });

// client.on('end', () => {
//     console.log('Disconnected from server');
// });

// client.on('error', (err) => {
//     console.error(err);
// });
// //test