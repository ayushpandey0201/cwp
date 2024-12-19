import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      email: email,
    };

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Convert the data to JSON format
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login, e.g., redirect user
        console.log('Login successful:', data);
        // Redirect to dashboard or home page
        // window.location.href = '/dashboard'; // Example redirect
      } else {
        // Handle errors (e.g., invalid credentials)
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
