const net = require("net");
const Protocol = require("./protocol");
const protocol = new Protocol();

const clients = new Set(); // Set to store connected TCP sockets
function broadcastToAllClients(message) {
  // Iterate through all connected clients and send the message
  for (const c of clients) {
    c.write(message);
  }
}

function isUsernameTaken(username) {
  for (const client of clients) {
    if (client.username === username) {
      return true;
    }
  }
  return false;
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const packet = protocol.parseMessage(data.toString());

    switch (packet.messageType) {
      case "JOIN":
        if (packet.username === null) {
          console.log("1");
          socket.write(protocol.createErrorMessage("Invalid username"));
        } else if (isUsernameTaken(packet.username)) {
          console.log("2");
          socket.write(protocol.createErrorMessage("Username taken"));
        } else {
          broadcastToAllClients(
            protocol.createNotificationMessage(
              packet.username,
              "has joined the chat"
            )
          );
          socket.username = packet.username;
          socket.write(protocol.createOkayMessage(packet.username));
          clients.add(socket);
          console.log(`@${socket.username} connected.`);
        }
        break;

      case "CHAT":
        if (packet.username === null || packet.username !== socket.username) {
          console.log("3");
          socket.write(protocol.createErrorMessage("Invalid username"));
        } else {
          broadcastToAllClients(
            protocol.createNotificationMessage(packet.username, packet.message)
          );
        }
        break;

      case "LEAV":
        if (packet.username === null || packet.username !== socket.username) {
          console.log("4");
          socket.write(protocol.createErrorMessage("Invalid username"));
        }
        broadcastToAllClients(
          protocol.createNotificationMessage(
            packet.username,
            "has left the chat"
          )
        );
        clients.delete(socket);
        break;

      default:
        socket.write(
          protocol.createErrorMessage("Unknown message type")
        );
        console.log(`Unknown message type: ${packet.messageType}`);
    }
  });

  server.on("connection", (socket) => {
    //clients.add(socket);
    console.log("Client connected to TCP server");
  });

  socket.on("end", () => {
    // clients.delete(socket);
    console.log("Client disconnected");
  });
});

server.on("error", (err) => {
  throw err;
});

const PORT = 90;
// server.listen()
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
