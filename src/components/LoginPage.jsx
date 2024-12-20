import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.error) {
      console.error('Google login error:', response.error);
      alert('Google login failed. Please try again.');
      return;
    }

    const googleToken = response.credential;
    console.log('Google Token:', googleToken); // Debugging

    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          alert('Login successful! Redirecting...');
          setUser(data.user);
          navigate('/home');
        } else if (data.message === 'Access denied. Only college emails are allowed.') {
          alert('Access denied. Only college emails are allowed.');
        } else {
          alert('An unexpected error occurred. Please try again.');
          console.error('Login failed:', data.message);
        }
      })
      .catch((err) => {
        alert('Server error. Please try again later.');
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
          width="250"
          text="signin_with"
        />
      </div>
    </div>
  );
};

export default LoginPage;
