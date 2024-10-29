import React from "react";

const Features = () => {
  return (
    <div className="features-wrapper">
      <div className="features-container">
        <h2 className="features-heading">Key Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>💬 Messaging</h3>
            <p>Exchange messages with ease.</p>
          </div>
          <div className="feature-item">
            <h3>🔒 Private Chats</h3>
            <p>
              Stay connected with friends, colleagues, and family through
              private conversations.
            </p>
          </div>
          <div className="feature-item">
            <h3>⚡ Seamless Experience</h3>
            <p>
              Enjoy a sleek interface that keeps your chats flowing smoothly,
              without distractions.
            </p>
          </div>
          <div className="feature-item">
            <h3>👥 User List</h3>
            <p>See all available users and start conversations in a click.</p>
          </div>
        </div>
      </div>
      <img src="/chat1.png" alt="chat" id="chat1" />
    </div>
  );
};

export default Features;
