import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginButton() {
  const handleSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  // TODO: Replace with your actual Google OAuth Client ID
  // Get this from Google Cloud Console: https://console.cloud.google.com/
  // Make sure to add http://localhost:3000 to the authorized origins
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
}

export default LoginButton;
