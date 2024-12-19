import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.error) {
      toast.error('Google login failed. Please try again.', {
        position: 'top-right',  // Use string for position
        autoClose: 5000,
        hideProgressBar: true,
      });
      console.error('Google login error:', response.error);
      return;
    }

    const googleToken = response.credential;
    console.log('Google Token:', googleToken); // Debugging

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          toast.success('Login successful! Redirecting...', {
            position: 'top-right', // Use string for position
            autoClose: 3000,
            hideProgressBar: false,
          });
          setUser(data.user);
          navigate('/home');
        } else if (data.message === 'Access denied. Only college emails are allowed.') {
          toast.error('Access denied. Only college emails are allowed.', {
            position: 'top-right', // Use string for position
            autoClose: 5000,
            hideProgressBar: true,
          });
        } else {
          toast.error('An unexpected error occurred. Please try again.', {
            position: 'top-right', // Use string for position
            autoClose: 5000,
            hideProgressBar: true,
          });
          console.error('Login failed:', data.message);
        }
      })
      .catch((err) => {
        toast.error('Server error. Please try again later.', {
          position: 'top-right', // Use string for position
          autoClose: 5000,
          hideProgressBar: true,
        });
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
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
