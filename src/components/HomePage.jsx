import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { FaComments, FaPaperPlane, FaTimes, FaArrowLeft, FaUser } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userAlias, setUserAlias] = useState('');
  const [privateRoomId, setPrivateRoomId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    setUser(storedUser);

    const alias = uuidv4();
    setUserAlias(alias);

    const socketConnection = io('http://localhost:5000', {
      withCredentials: true,
    });
    setSocket(socketConnection);

    socketConnection.on('receivePublicMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketConnection.on('receivePrivateMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketConnection.on('privateChatStarted', ({ roomId }) => {
      setPrivateRoomId(roomId);
    });

    socketConnection.on('chatHistory', (history) => {
      setMessages(history);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleStartPublicChat = () => {
    setShowChat(true);
    setIsPublic(true);
    socket.emit('joinPublicChat', userAlias);
  };

  const handleStartPrivateChat = () => {
    setShowChat(true);
    setIsPublic(false);
    socket.emit('startPrivateChat');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: userAlias, alias: userAlias, message };
      if (isPublic) {
        socket.emit('sendPublicMessage', newMessage);
      } else if (privateRoomId) {
        socket.emit('sendPrivateMessage', { roomId: privateRoomId, message, alias: userAlias });
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleExit = () => {
    setShowChat(false);
    setMessages([]);
    setMessage('');
    setPrivateRoomId(null);
  };

  const handleBack = () => {
    setShowChat(false);
    setMessages([]);
    setMessage('');
    setPrivateRoomId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {!showChat ? (
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <h1>Welcome back, {user.name}!</h1>
              <p className="user-email">{user.email}</p>
            </div>

            <div className="app-description">
              <h2>Anonymous Campus Chat</h2>
              <p>
                Connect with your campus community anonymously. Share thoughts,
                ask questions, and engage in meaningful conversations with your peers.
              </p>
            </div>

            <button className="start-chat-btn" onClick={handleStartPublicChat}>
              <FaComments /> Join Public Chat
            </button>

            <button className="start-chat-btn" onClick={handleStartPrivateChat}>
              <FaComments /> Start Private Chat
            </button>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>100% Anonymous</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎓</span>
                <span>Campus Only</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>Real-time Chat</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft />
            </button>
            <h2>{isPublic ? 'Public Campus Chat' : 'Private Chat'}</h2>
            <button className="exit-btn" onClick={handleExit}>
              <FaTimes />
            </button>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <FaComments />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="message">
                  <div className="message-header">
                    <span className="user-alias">Anonymous User</span>
                    <span className="message-time">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <textarea
              className="message-input"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <div className="input-actions">
              <button className="skip-btn" onClick={() => setMessage('')}>
                Clear
              </button>
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;