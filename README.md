# network-application-protocol
1. Introduction: The ChatRoomProtocol is an extension of the CustomAppProtocol, tailored to ./TCP transport layer for reliable communication but includes additional features for managing multiple users in a chat room.

2. Message Format:
    2.1 Server Message Format: | Type | Length | SenderID | RoomID | Data |
    - Type: Specifies the type of the message (e.g., chat, command, notification).
    - Length: Represents the length of the data field.
    - SenderID: Identifies the sender of the message.
    - RoomID: Identifies the chat room.

2.2 Client Message Format:
| Type | Length | RoomID | Data |
Follows the same structure as the server message format.

2.3 Handshaking Process:
| Type | Length | Handshake Step | Data |
Follows the same structure as the original handshaking process in CustomAppProtocol.



3. Handshaking Process:
    3.1 Three-Way Handshake: Follows the same steps as described in the CustomAppProtocol.

4. Protocol Operation After Handshaking:
User Joining a Chat Room:
| Type | Length | RoomID | Data       |
|------|--------|--------|------------|
| JOIN | n      | Room1  | User123    |
A user joins a chat room by sending a JOIN message with their username.

5. Chat Message:
| Type | Length | SenderID | RoomID | Data                |
|------|--------|----------|--------|---------------------|
| CHAT | n      | User123  | Room1  | Hello, everyone!   |
Users exchange chat messages with the CHAT type.

6. Chat Room Command:
| Type | Length | RoomID | Data         |
|------|--------|--------|--------------|
| CMD  | n      | Room1  | /listusers   |
Users can send commands to the chat room (e.g., /listusers).

7. User Leaving a Chat Room:
| Type | Length | RoomID | Data     |
|------|--------|--------|----------|
| LEAVE| n      | Room1  | User123  |
A user leaves a chat room by sending a LEAVE message.
Notification of User Joining/Leaving:
Notifications are sent when a user joins or leaves a chat room.

8. Error Handling: 

Error messages (e.g., invalid command, user not found) are sent as part of the DATA message type.

9. Checksum for Error Detection:

Each message includes a checksum for error detection.
This ChatRoomProtocol extends the original CustomAppProtocol to support real-time communication in a chat room setting, incorporating user identification, chat commands, and notifications for user actions within the chat room.
