import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true); // State to toggle forms

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('activeUsers', (users) => {
      setActiveUsers(users.filter(id => id !== user?.userId));
    });

    return () => {
      socket.off('message');
      socket.off('activeUsers');
    };
  }, [user]);

  useEffect(() => {
    if (user && selectedUser) {
      fetchMessages();
    }
  }, [user, selectedUser]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
        headers: { 'Authorization': user.token }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage && user && selectedUser) {
      socket.emit('sendMessage', {
        senderId: user.userId,
        receiverId: selectedUser._id,
        content: inputMessage
      });
      setInputMessage('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        socket.emit('login', data.userId);
        fetchActiveUsers(data.token);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error logging in');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, password: registerPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setError('Registration successful. Please log in.');
        setShowLoginForm(true); // Show login form after successful registration
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error registering');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setSelectedUser(null);
    socket.emit('logout');
  };

  const fetchActiveUsers = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': token }
      });
      const data = await response.json();
      setActiveUsers(data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const selectUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setMessages([]);
  };

  const showLogin = () => setShowLoginForm(true);
  const showRegister = () => setShowLoginForm(false);

  if (!user) {
    return (
      <div className="App">
        <h1>ChatterBox, Chatting made easy!</h1>
        <div className="auth-container">
          <h2>Please login or register.</h2>
          <div className="button-container">
        <button onClick={showLogin}>Login</button>
        <button onClick={showRegister}>Register</button>
        </div>

          {showLoginForm ? (
            <form onSubmit={handleLogin}>
              <h2>Already Registered? Login Here!</h2>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2>New Here? Register!</h2>
              <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>ChatterBox, Chatting made easy!</h1>
      <p>Welcome, {user.username} to ChatterBox! <br /><br /><button onClick={handleLogout}>Logout</button></p>
      <div className="chat-container">
        <div className="user-list">
          <h2>Chat with whom?</h2>
          <ul>
            {activeUsers.map(u => (
              <li key={u._id} onClick={() => selectUser(u)} className={selectedUser?._id === u._id ? 'selected' : ''}>
                {u.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-window">
          {selectedUser ? (
            <>
              <h2>Chat with {selectedUser.username}</h2>
              <div className="messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender._id === user.userId ? 'sent' : 'received'}`}>
                    <strong>{msg.sender.username}: </strong>{msg.content}
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p>Select someone to start chatting!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
