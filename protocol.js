// protocol.js
const MessageType = {
    JOIN: 'JOIN',
    CHAT: 'CHAT',
    CMD: 'CMD',
    LEAVE: 'LEAVE',
    NOTE: 'NOTE',
    ERROR: 'ERROR',
  };
  
  class ChatRoomProtocol {
    static createJoinMessage(roomID, username) {
      return `${MessageType.JOIN} ${roomID} ${username}`;
    }
  
    static createChatMessage(roomID, senderID, message) {
      return `${MessageType.CHAT} ${roomID} ${senderID} ${message}`;
    }
  
    static createCommandMessage(roomID, command) {
      return `${MessageType.CMD} ${roomID} ${command}`;
    }
  
    static createLeaveMessage(roomID, username) {
      return `${MessageType.LEAVE} ${roomID} ${username}`;
    }
  
    static createNotificationMessage(roomID, username) {
      return `${MessageType.NOTE} ${roomID} ${username}`;
    }
  
    static createErrorMessage(errorMsg) {
      return `${MessageType.ERROR} ${errorMsg}`;
    }
  
    static parseMessage(message) {
      const [type, roomID, ...rest] = message.split(' ');
      const data = rest.join(' ');
      return { type, roomID, data };
    }
  }
  
  module.exports = { ChatRoomProtocol, MessageType };
  