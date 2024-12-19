import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginButton() {
  const handleSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
}

export default LoginButton;
