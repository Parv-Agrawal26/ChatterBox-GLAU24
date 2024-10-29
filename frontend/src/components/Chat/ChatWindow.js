import React from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatWindow = ({ selectedUser, messages, user, inputProps }) => {
  return (
    <div className="chat-window">
      {selectedUser ? (
        <>
          <h2>Chat with {selectedUser.username}</h2>
          <MessageList messages={messages} currentUserId={user.userId} />
          <ChatInput {...inputProps} />
        </>
      ) : (
        <p>Select someone to start chatting!</p>
      )}
    </div>
  );
};

export default ChatWindow;
