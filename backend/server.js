const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { User, Chat } = require('./models/User');
const { v4: uuidv4 } = require('uuid'); // For generating unique aliases

dotenv.config();

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

// Middleware to set COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies and other credentials
  })
);

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  },
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Login route for Google authentication
app.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Your Google Client ID
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email;

    // Validate email domain
    if (!googleEmail.endsWith('@bmsce.ac.in')) {
      return res.status(403).json({ message: 'Access denied. Only @bmsce.ac.in emails are allowed.' });
    }

    // Check if user exists or create a new one
    let user = await User.findOne({ email: googleEmail });
    if (!user) {
      user = new User({
        name: payload.name,
        email: googleEmail,
      });
      await user.save();
    }

    // Generate a unique alias for the user
    const alias = uuidv4();

    res.status(200).json({
      message: 'Login successful',
      user: { // Send user details
        name: user.name,
        email: user.email,
      },
      alias, // Return the alias to the frontend
    });
  } catch (error) {
    console.error('Error during Google login verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// WebSocket: Anonymous Chat Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  let userAlias; // Declare alias to store it for the user

  // When a user joins the chat, send them the chat history
  socket.on('joinChat', async (alias) => {
    userAlias = alias; // Store the alias sent from the frontend
    const chatHistory = await Chat.find().sort({ timestamp: 1 }); // Fetch all messages sorted by time
    socket.emit('chatHistory', chatHistory);
  });

// Listen for new messages and save them
socket.on('sendMessage', async (data) => {
  const { message, alias } = data; // Make sure you're using alias here

  // Save message to MongoDB with the sender's alias
  const newMessage = new Chat({ sender: alias, message });
  await newMessage.save();

  // Broadcast the message to all other clients except the sender
  socket.broadcast.emit('receiveMessage', newMessage);
});


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
