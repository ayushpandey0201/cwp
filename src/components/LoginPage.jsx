import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Assuming you have a CSS file

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.error) {
      console.error('Google login error:', response.error);
      return;
    }

    const googleToken = response.credential;

    fetch('http://localhost:5000/login', {   // This is where the token is sent to the backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),  // Send the Google token
    })
    
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          setUser(data.user);
          navigate('/home');
        } else {
          console.log('Login failed:', data.message);
        }
      })
      .catch((err) => {
        console.error('Error during login:', err);
      });
  };

  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <div className="google-login-container">
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={(error) => console.log('Login Failed', error)}
          theme="filled_blue"
          shape="rectangular"
          width="250" // Customize button width
          text="signin_with" // Use 'signin_with' for "Sign in with Google"
        />
      </div>
    </div>
  );
};

export default LoginPage;
