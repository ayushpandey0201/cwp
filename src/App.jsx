import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage'; // Import LoginPage
import HomePage from './components/HomePage';   // Import HomePage
import ContactPage from './components/ConctactPage'; // Import ContactPage
import AboutPage from './components/AboutPage';
import { googleLogout } from '@react-oauth/google'; // Import googleLogout

const App = () => {
  const [user, setUser] = useState(null); // Store user info after login

  // Google OAuth Client ID - use environment variable or fallback
  // Make sure this client ID has http://localhost:3000 in authorized origins in Google Cloud Console
  const GOOGLE_CLIENT_ID =  "270104599039-h79kak4mdr6uosq4mqm3a5bvmkcfgfp2.apps.googleusercontent.com";

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

    // Redirect to login page (or wherever you need)
    window.location.href = '/';  // Adjust based on your routing setup
  };

  const Navbar = () => (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        padding: '10px 20px',
        color: '#C0C0C0',
      }}
    >
      <div>
        <Link to="/home" style={{ color: '#9D4EDD', textDecoration: 'none', marginRight: '15px' }}>Home</Link>
        <Link to="/contact" style={{ color: '#9D4EDD', textDecoration: 'none', marginRight: '15px' }}>Contact</Link>
        <Link to="/about" style={{ color: '#9D4EDD', textDecoration: 'none' }}>About</Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#9D4EDD',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Logout
      </button>
    </nav>
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
