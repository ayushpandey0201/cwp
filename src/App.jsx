import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage'; // Import LoginPage
import HomePage from './components/HomePage';   // Import HomePage
import ContactPage from './components/ConctactPage'; // Import ContactPage
import { googleLogout } from '@react-oauth/google'; // Import googleLogout

const App = () => {
  const [user, setUser] = useState(null); // Store user info after login
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // If user found in localStorage, set it in state
    }
  }, []);
  const handleLogout = () => {
    // Call googleLogout to sign out from Google
    googleLogout();

    // Clear user data from localStorage
    localStorage.removeItem('user');

    // Optionally, disconnect socket if needed
    if (socket) {
      socket.disconnect();
    }

    // Redirect to login page (or wherever you need)
    window.location.href = '/';  // Adjust based on your routing setup
  };

  const Navbar = () => (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '10px 20px',
        color: 'white',
      }}
    >
      <div>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Home</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Contact</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Logout
      </button>
    </nav>
  );

  return (
    <GoogleOAuthProvider clientId="270104599039-h79kak4mdr6uosq4mqm3a5bvmkcfgfp2.apps.googleusercontent.com">
      <Router>
        {/* Show Navbar only if the user is logged in */}
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/home"
            element={user ? <HomePage user={user} /> : <LoginPage setUser={setUser} />}
          />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
