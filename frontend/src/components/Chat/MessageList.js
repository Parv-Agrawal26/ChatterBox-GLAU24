import React from "react";

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.sender._id === currentUserId ? "sent" : "received"
          }`}
        >
          <strong>{msg.sender.username}: </strong>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
