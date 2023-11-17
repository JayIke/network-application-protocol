// protocol.js
const ChatRoomProtocol = {
    MessageType: {
      JOIN: 'JOIN',
      CHAT: 'CHAT',
      NOTIFICATION: 'NOTIFICATION',
      ERROR: 'ERROR',
      CMD: 'CMD',
      OKAY: 'OKAY',
      LEAVE: 'LEAVE',
    },
  
    createJoinMessage(roomID, username) {
      return `${this.MessageType.JOIN} ${roomID} ${username}`;
    },
  
    createChatMessage(roomID, sender, message) {
      return `${this.MessageType.CHAT} ${roomID} ${sender} ${message}`;
    },
  
    createNotificationMessage(roomID, message) {
      return `${this.MessageType.NOTIFICATION} ${roomID} ${message}`;
    },
  
    createErrorMessage(message) {
      return `${this.MessageType.ERROR} ${message}`;
    },
  
    createLeaveMessage(roomID, username) {
      return `${this.MessageType.LEAVE} ${roomID} ${username}`;
    },
  
    parseMessage(data) {
      const parts = data.split(' ');
      const type = parts[0];
      const roomID = parts[1];
      const rawData = parts.slice(2).join(' ');
  
      let messageType;
      let parsedData;
  
      switch (type) {
        case this.MessageType.JOIN:
          messageType = this.MessageType.JOIN;
          parsedData = rawData;
          break;
  
        case this.MessageType.CHAT:
          messageType = this.MessageType.CHAT;
          const [sender, chatMessage] = rawData.split(' ');
          parsedData = { sender, message: chatMessage };
          break;
  
        case this.MessageType.NOTIFICATION:
          messageType = this.MessageType.NOTIFICATION;
          parsedData = rawData;
          break;
  
        case this.MessageType.ERROR:
          messageType = this.MessageType.ERROR;
          parsedData = rawData;
          break;
  
        case this.MessageType.LEAVE:
          messageType = this.MessageType.LEAVE;
          parsedData = rawData;
          break;
  
        default:
          messageType = 'UNKNOWN';
          parsedData = data;
          break;
      }
  
      return {
        type: messageType,
        roomID,
        data: parsedData,
      };
    },
  };
  
  module.exports = { ChatRoomProtocol };
  