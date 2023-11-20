# network-application-protocol
## External Requirements: 
- Ensure you have node.js and npm installed https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.
- Navigate to local copy after cloning this repostiory and run "npm install". This should download all required dependencies for the node.js files.
- Make sure Python is installed. To get your current python version type "py -0" in your cmd prompt. Additional setup instructions can be found at https://code.visualstudio.com/docs/python/python-tutorial.
- *Note: Use "node <filename.js>" and "python <filename.py>" to run node.js and .py files. However, running the "chat.bat" file will automatically start the necessary files in order.*

## User Guide:
### Introduction
The chatroom application protocol is defined in [protocol.js](./protocol.js) and is used by both [client.js](./client.js) and [server.js](./server.js). Our node.js server utilized the .net module and is built on top of a TCP connection. [chatroom_gui.py](./chatroom_gui.py) simulates a program without direct utilization of the protocol file, hence, the protocol commands must be deliberately input in the message stream to the server. Node.js clients do not need to type commands, however, the "LEAV" function is optional.

### Order of operations
The [chat.bat](./chat.bat) can be executed to automatically run the necessary files in order. Alternatively, the following manual sequence is as follows:

Files:
node Server.js -> python chatroom_gui.py -> node client.js

Once these files are executed, navigate to the specified file and execute the commands:
FILE: **Command** *<INPUT>*
1) Python GUI: **JOIN** *<USERNAME>*
2) Node Client(s): *<USERNAME>*

At this point, the Node.js clients can chat freely when connected. Alternatively, they can reset their connection via **LEAV** command.

**Python GUI**: Requires the raw protocol inputs i.e., JOIN/CHAT/LEAV. Since the chat gui does not directly implement the protocol functions, it will have to interact with other users in the chat room by manually entering and formating the appropriate protocol commands to the server.

### Command Guide
**JOIN**: **JOIN** *<Username>*
- Client-side initiate handshake request command. This is the first header field defined in the Protocol.MessageType field (4 Bytes). Upon connecting to the server via .net socket, the server waits for the **<Username>** of the requestee and if the username is not already connected, it prompts the user for a different username. Otherwise, an **OKAY** message is returned by the server indicating completion of the handshake process.

**OKAY**:
- Server-response accepting client connection and indicating completion of the handshake process. The client information is temporarily stored, connection is complete, and the user can now interact with other connected clients.
  
**NOTI**: **NOTI** *<Username> <Message>*
- Server-response sent when a user joins or leaves the chatroom. This is broadcasted to all active client connections and follows an **OKAY** response upon and client joining the chatroom or is triggered by a **LEAV** request sent by the client indicating they are leaving.

**CHAT**: **CHAT** *<Username> <Message>*
- The primary client-side message type that tells the server a general chat message is to be sent to the chatroom. The server checks the Username to ensure it is a connected client and broadcasts the message to the chatroom. If an invalid username is provided a **NOID** **EERR** message is returned to the requestee and the message is not broadcasted.
  
**LEAV**: **LEAV** *<Username>*
- Client-request telling the server the client is leaving. The server closes the TCP socket connection and broadcasts a **NOTI** message to connected clients indicating the user who left the chat. The stored information of the leaving client is removed from the Client property set.

**EERR**: **EERR** *<Sender> <Message>*
- Both client and server message indicating an error was received, who it's from, and the error message. Error handling is achieved on both sides.



