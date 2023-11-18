// protocol.js
const ChatRoomProtocol = {
    MessageType: {
      JOIN: 'JOIN',
      OKAY: 'OKAY',
      NOTI: 'NOTI',
      LEAV: 'LEAV',
      CHAT: 'CHAT',
      EERR: 'EERR',
    },
    
    createJoinRequest(username) {
      return `${this.MessageType.JOIN} ${username}`;
    },
  
    createChatMessage(sender, message) {
      return `${this.MessageType.CHAT} ${sender} ${message}`;
    },

    createOkayMessage(message) {
      return `${this.MessageType.OKAY} ${message}`;
    },
  
    createNotificationMessage(sender, message) {
      return `${this.MessageType.NOTI} ${sender} ${message}`;
    },
  
    createErrorMessage(sender, message) {
      return `${this.MessageType.EERR} ${sender} ${message}`;
    },
  
    createLeaveMessage(sender, username) {
      return `${this.MessageType.LEAV} ${sender} ${username}`;
    },
  
    parseMessage(data) {
      const type = data.substr(0,4); // message type
      
      const id = data.substr(' ', 5);
      const last = id.lastIndexOf(id);
      const rawData = data.substr(last);
  
      let messageType;
      let user;
      //let length = type.length + user.length + rawData.length;
      let parsedData;
      switch (type) {
        case this.MessageType.JOIN:
          messageType = this.MessageType.JOIN;
          user = id;
          break;

        case this.MessageType.OKAY:
          messageType = this.MessageType.OKAY;
          //user = id;
          parsedData = rawData;
          break;
  
        case this.MessageType.CHAT:
          messageType = this.MessageType.CHAT;
          user = id;
          parsedData = rawData;
          break;
  
        case this.MessageType.NOTI:
          messageType = this.MessageType.NOTI;
          user = id;
          parsedData = rawData;
          break;
  
        case this.MessageType.EERR:
          messageType = this.MessageType.EERR;
          user = id;
          parsedData = rawData;
          break;
  
        case this.MessageType.LEAV:
          messageType = this.MessageType.LEAV;
          user = id;
          parsedData = rawData;
          break;
  
        default:
          messageType = 'UNKNOWN';
          parsedData = data;
          break;
      }
  
      return {
        type: messageType,
        sender: user,
        message: parsedData,
      };
    },
  };
  
  module.exports = { ChatRoomProtocol };
  