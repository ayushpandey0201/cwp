import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

export default function HomePage({ user, setUser }) {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    setUser(null); // Clear the user state
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      <h1>Hi, {user.name}! Welcome!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
