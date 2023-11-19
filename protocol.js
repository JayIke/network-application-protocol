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
    ErrorMessage: {
      NOID: 'Invalid username, please send JOIN <username>',
    },
    
    createJoinRequest(sender) {
      return `${this.MessageType.JOIN} ${sender}`;
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
  
    createLeaveMessage(sender) {
      return `${this.MessageType.LEAV} ${sender}`;
    },
  
    parseMessage(data) {
      const type = data.substring(0,4); // message type
      const temp = data.substring(5);
      const userIndex = temp.indexOf(' ')
      const id = temp.substring(5,userIndex);
      const rawData = data.substring(userIndex+1).trim();
      
  
      let messageType;
      let user;
      //let length = type.length + user.length + rawData.length;
      let parsedData;
      switch (type) {
        case 'JOIN':
          messageType = this.MessageType.JOIN;
          user = data.substring(5).trim();
          
          
          break;

        case 'OKAY':
          messageType = this.MessageType.OKAY;
          user = id;
          parsedData = rawData;
          break;
  
        case 'CHAT':
          messageType = this.MessageType.CHAT;
          user = id;
          parsedData = rawData;
          break;
  
        case 'NOTI':
          messageType = this.MessageType.NOTI;
          user = id;
          parsedData = rawData;
          break;
  
        case 'EERR':
          messageType = this.MessageType.EERR;
          
          user = id;
          parsedData = rawData;
          break;
  
        case 'LEAV':
          messageType = this.MessageType.LEAV;
          user = data.substring(5).trim();
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
  