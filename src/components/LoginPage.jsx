import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserGraduate } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogin = async (response) => {
    const token = response.credential;

    try {
      const res = await axios.post('http://localhost:5000/login', { token });

      if (res.data.user) { // Check if user data is returned
        setUser({
          name: res.data.user.name,
          email: res.data.user.email,
        });
        localStorage.setItem('user', JSON.stringify({
          name: res.data.user.name,
          email: res.data.user.email,
        }));
        navigate('/home');
      } else {
        toast.error('Login failed. Please use your college email address.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Login error: ' + error.message, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <FaUserGraduate className="icon" />
        <h2>Welcome to Campus Connect</h2>
        <p className="subtitle">Your gateway to anonymous campus conversations</p>
        <p className="description">
          Campus Connect is a unique platform designed exclusively for college students. 
          Here, you can engage in anonymous discussions, share ideas, and connect with 
          peers across your campus. Our app ensures your privacy while fostering open 
          and honest communication within your college community.
        </p>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => toast.error('Login Failed', {
            position: 'top-center',
            autoClose: 3000,
          })}
          className="google-login-button"
        />
        <p className="login-note">Please log in with your college email address to access the app.</p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
