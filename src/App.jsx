import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage'; // Import LoginPage
import HomePage from './components/HomePage';   // Import HomePage

const App = () => {
  const [user, setUser] = useState(null); // Store user info after login

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // If user found in localStorage, set it in state
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="270104599039-h79kak4mdr6uosq4mqm3a5bvmkcfgfp2.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/home"
            element={user ? <HomePage user={user} /> : <LoginPage setUser={setUser} />}
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
