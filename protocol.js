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

    createOkayMessage(sender) {
      return `${this.MessageType.OKAY} ${sender}`;
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
      const userIndex = temp.indexOf(' ');
      let id = temp.substring(0,userIndex);
      let rawData = temp.substring(userIndex);
     
      let messageType;
      let user;
      let parsedData;
      switch (type) {
        case 'JOIN':
          messageType = this.MessageType.JOIN;
          user = data.substring(5).trim();
          
          
          break;

        case this.MessageType.OKAY:
          messageType = 'OKAY';
          user = data.substring(5).trim();
          //parsedData = rawData;
          break;
  
        case this.MessageType.CHAT:
          messageType = 'CHAT';
          
          user = id;
          parsedData = rawData.trim();
          break;
  
        case this.MessageType.NOTI:
          messageType = 'NOTI';
          user = id;
          parsedData = rawData.trim();
          break;
  
        case this.MessageType.EERR:
          messageType = 'EERR';
          user = id;
          parsedData = rawData;
          break;
  
        case this.MessageType.LEAV:
          messageType = 'LEAV';
          user = data.substring(5).trim();
          break;
  
        default:
          messageType = 'UNKNOWN';
          parsedData = data.trim();
          break;
      };
  
      return {
        type: messageType,
        sender: user,
        message: parsedData,
      };
    },
  };
  
  module.exports = { ChatRoomProtocol };
  