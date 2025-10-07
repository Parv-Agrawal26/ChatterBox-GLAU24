import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import AuthPage from "./components/Auth/AuthPage";
import UserList from "./components/Chat/UserList";
import ChatWindow from "./components/Chat/ChatWindow";
import * as api from "./services/api";
import socket from "./services/socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const loginSectionRef = useRef(null);

  const onEmojiClick = (emojiData) => {
    setInputMessage((prevInput) => prevInput + emojiData.emoji);
  };

  useEffect(() => {
    if (user) {
      api.fetchUsers().then(setUsers).catch(console.error);

      // inform server about connected user
      try {
        socket.emit("user_connected", user.userId || user._id || user.id);
      } catch (e) {
        // ignore if socket not ready
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) {
      api
        .fetchMessages(selectedUser._id)
        .then(setMessages)
        .catch(console.error);

      const interval = setInterval(() => {
        api
          .fetchMessages(selectedUser._id)
          .then(setMessages)
          .catch(console.error);
      }, 3000);

      // Listen for incoming messages via socket and append if they belong to this conversation
      const onNewMessage = (message) => {
        // message.receiver may be the current user and sender is selectedUser, or vice versa
        const otherId = selectedUser._id || selectedUser.id;
        const currentUserId = user.userId || user._id || user.id;
        if (
          (message.sender &&
            message.sender._id === otherId &&
            message.receiver &&
            message.receiver._id === currentUserId) ||
          (message.receiver &&
            message.receiver._id === otherId &&
            message.sender &&
            message.sender._id === currentUserId)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on("new_message", onNewMessage);

      return () => {
        clearInterval(interval);
        socket.off("new_message", onNewMessage);
      };
    }
  }, [user, selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage && user && selectedUser) {
      try {
        const newMessage = await api.sendMessage(
          selectedUser._id,
          inputMessage
        );
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(loginEmail, loginPassword);
      if (!data.error) {
        setUser(data);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Error logging in");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await api.register(
        registerUsername,
        registerEmail,
        registerPassword
      );
      if (!data.error) {
        setError("Registration successful. Please log in.");
        setShowLoginForm(true);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Error registering");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setMessages([]);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    const loginProps = {
      loginEmail,
      setLoginEmail,
      loginPassword,
      setLoginPassword,
      handleLogin,
    };

    const registerProps = {
      registerUsername,
      setRegisterUsername,
      registerEmail,
      setRegisterEmail,
      registerPassword,
      setRegisterPassword,
      handleRegister,
    };

    return (
      <AuthPage
        loginSectionRef={loginSectionRef}
        showLoginForm={showLoginForm}
        setShowLoginForm={setShowLoginForm}
        loginProps={loginProps}
        registerProps={registerProps}
        error={error}
      />
    );
  }

  const chatInputProps = {
    inputMessage,
    setInputMessage,
    sendMessage: handleSendMessage,
    showPicker,
    setShowPicker,
    onEmojiClick,
  };

  return (
    <div className="App">
      <h1>ChatterBox, Chatting made easy!</h1>
      <p>
        Welcome, {user.username} to ChatterBox! <br />
        <br />
        <button onClick={handleLogout}>Logout</button>
      </p>
      <div className="chat-container">
        <UserList
          users={users}
          selectedUser={selectedUser}
          selectUser={setSelectedUser}
        />
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          user={user}
          inputProps={chatInputProps}
        />
      </div>
    </div>
  );
}

export default App;
