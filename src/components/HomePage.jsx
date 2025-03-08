import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google'; // Import googleLogout
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userAlias, setUserAlias] = useState(''); // Random alias for the user

  useEffect(() => {
    // Fetch user data from localStorage (simulate logged-in user)
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    setUser(storedUser);

    // Generate a random user alias using uuid
    const alias = uuidv4(); // Generate a random alias
    setUserAlias(alias);

    // Connect to WebSocket server on backend
    const socketConnection = io('http://localhost:5000', {
      withCredentials: true,
    });
    setSocket(socketConnection);

    // Listen for incoming messages
    socketConnection.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => {
        // Prevent duplicate messages
        if (!prevMessages.some(msg => msg._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    return () => {
      // Clean up socket connection on component unmount
      socketConnection.disconnect();
    };
  }, []);

  const handleStartChat = () => {
    setShowChat(true); // Display chat interface
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: userAlias, alias: userAlias, message }; // Use alias as sender
      socket.emit('sendMessage', newMessage); // Emit message to backend

      // Optionally update the UI with the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage(''); // Clear input
    }
  };

  const handleSkip = () => {
    setMessage(''); // Clear input without sending
  };

  const handleExit = () => {
    setShowChat(false); // Hide chat interface
    setMessage(''); // Reset message state
  };

  const handleBack = () => {
    setShowChat(false); // Hide chat interface without clearing message
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
     

      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>

      {!showChat ? (
        <button
          onClick={handleStartChat}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Start Chat
        </button>
      ) : (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            backgroundColor: '#f9f9f9',
            width: '400px',
            margin: '0 auto',
          }}
        >
          <h2>Chat Interface</h2>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'scroll',
              marginBottom: '10px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.alias}:</strong> {msg.message} {/* Display alias here */}
              </div>
            ))}
          </div>
          <textarea
            rows="4"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSendMessage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Send Message
            </button>
            <button
              onClick={handleSkip}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              Skip
            </button>
            <button
              onClick={handleExit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Exit
            </button>
            <button
              onClick={handleBack}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffeb3b',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
