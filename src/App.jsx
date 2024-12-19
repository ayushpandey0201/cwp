import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = useState(null);

  const CLIENT_ID = '270104599039-h79kak4mdr6uosq4mqm3a5bvmkcfgfp2.apps.googleusercontent.com'; // Replace with your actual Google Client ID

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
