class Protocol {
  static MessageType = {
    JOIN: "JOIN",
    CHAT: "CHAT",
    OKAY: "OKAY",
    EERR: "EERR",
    NOTI: "NOTI",
    LEAV: "LEAV",
  };

  createJoinMessage(username) {
    return `${Protocol.MessageType.JOIN} @${username}`;
  }

  createChatMessage(username, message) {
    return `${Protocol.MessageType.CHAT} @${username} ${message}`;
  }

  createNotificationMessage(username, message) {
    return `${Protocol.MessageType.NOTI} @${username} ${message}`;
  }

  createErrorMessage(message) {
    return `${Protocol.MessageType.EERR} ${message}`;
  }

  createLeaveMessage(username) {
    return `${Protocol.MessageType.LEAV} @${username}`;
  }

  createOkayMessage(username) {
    return `${Protocol.MessageType.OKAY} @${username}`;
  }

  parseMessage(input) {
    const parsed = {
      messageType: "",
      username: null,
      message: "",
    };

    // Check if the input is valid
    if (typeof input !== "string" || input.length < 4) {
      return parsed;
    }

    // Extract the message type (first 4 characters)
    parsed.messageType = input.substring(0, 4);

    // Remove the message type from the input
    const rest = input.substring(5);

    // Find the index of the first space after the username
    const firstSpaceIndex = rest.indexOf(" ");

    // Check if the username exists
    if (rest.startsWith("@")) {
      // Extract the username
      if (firstSpaceIndex !== -1) {
        parsed.username = rest.substring(1, firstSpaceIndex);
        // Extract the message content
        parsed.message = rest.substring(firstSpaceIndex + 1);
      } else {
        // The entire rest is the username
        parsed.username = rest.substring(1);
      }
    } else {
      // The rest of the input is the message content
      parsed.message = rest;
    }

    return parsed;
  }
}

module.exports = Protocol;
