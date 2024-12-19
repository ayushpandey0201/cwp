const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS only for specific origin
app.use(cors({ 
  origin: 'http://localhost:3000', // Allow only the frontend during development
  credentials: true,
}));

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.CLIENT_ID);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Routes
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: 'User saved successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user.', error: error.message });
  }
});

// Route to handle Google login
app.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    // Verify the Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Ensure the token was issued by your app
    });

    const payload = ticket.getPayload(); // Contains user info like email, name, etc.
    const googleEmail = payload.email;

    // Check if the email is from the allowed domain
    if (!googleEmail.endsWith('@bmsce.ac.in')) {
      return res.status(403).json({ message: 'Access denied. Only college emails are allowed.' });
    }

    // Check if the user exists in the database
    let user = await User.findOne({ email: googleEmail });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        name: payload.name,
        email: googleEmail,
      });
      await user.save();
    }

    // Send a response with user info
    res.status(200).json({
      message: 'Login successful',
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error during Google login verification:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
