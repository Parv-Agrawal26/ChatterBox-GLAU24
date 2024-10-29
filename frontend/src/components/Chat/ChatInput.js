import React from "react";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  showPicker,
  setShowPicker,
  onEmojiClick,
}) => {
  return (
    <div className="chat-input-container">
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <div className="picker-container">
          <button
            className="emoji-icon"
            onClick={(e) => {
              e.preventDefault();
              setShowPicker((val) => !val);
            }}
          >
            Use Emoji😀
          </button>

          {showPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker
                pickerStyle={{ width: "200px" }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
