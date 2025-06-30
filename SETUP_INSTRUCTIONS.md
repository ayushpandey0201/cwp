# Setup Instructions

## Current Issues Fixed:
1. ✅ Removed restrictive CORS headers that were blocking postMessage
2. ✅ Updated Google OAuth configuration to use environment variables
3. ⚠️ Need to configure environment variables

## Required Environment Variables:

### Backend (.env file in backend/ directory):
```
CLIENT_ID=your_google_oauth_client_id_here
MONGO_URI=mongodb://localhost:27017/chat_app
PORT=5000
```

### Frontend (.env file in root directory):
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

## Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Application Type to "Web application"
6. Add Authorized Origins: `http://localhost:3000`
7. Add Authorized Redirect URIs: `http://localhost:3000`
8. Copy the Client ID and use it in both .env files

## MongoDB Setup:
1. Install MongoDB locally or use MongoDB Atlas
2. Update MONGO_URI in backend/.env accordingly

## Running the Application:
1. Start the backend: `cd backend && npm start`
2. Start the frontend: `npm start`

## Current Status:
- Backend server should start without CORS issues
- Frontend will load but Google OAuth won't work until CLIENT_ID is configured
- Chat functionality should work once both servers are running 