const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { User, Chat } = require('./models/User');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Google Login Route
app.post('/login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email;

    // Optional domain restriction
    if (process.env.ALLOWED_DOMAINS) {
      const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');
      const isAllowed = allowedDomains.some(domain => googleEmail.endsWith(domain.trim()));
      if (!isAllowed) {
        return res.status(403).json({ message: 'Access denied. Email domain not authorized.' });
      }
    }

    let user = await User.findOne({ email: googleEmail });
    if (!user) {
      user = new User({
        name: payload.name,
        email: googleEmail,
      });
      await user.save();
    }

    const alias = uuidv4();

    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
      },
      alias,
    });
  } catch (error) {
    console.error('Error during Google login verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// WebSocket Logic
let waitingUser = null; // For private chat pairing queue

io.on('connection', (socket) => {
  console.log('📡 User connected:', socket.id);

  let userAlias;

  // Join Public Chat
  socket.on('joinPublicChat', async (alias) => {
    userAlias = alias;
    socket.join('campusPublic');

    const chatHistory = await Chat.find({ roomId: 'campusPublic' }).sort({ timestamp: 1 });
    socket.emit('chatHistory', chatHistory);

    console.log(`👥 ${socket.id} joined campusPublic`);
  });

  // Send message in Public Chat
  socket.on('sendPublicMessage', async (data) => {
    const { message, alias } = data;
    const newMessage = new Chat({ roomId: 'campusPublic', sender: alias, message });
    await newMessage.save();

    io.to('campusPublic').emit('receivePublicMessage', newMessage);
  });

  // Start Private 1-on-1 Chat
  socket.on('startPrivateChat', () => {
    if (waitingUser) {
      const roomId = `private-${waitingUser.id}-${socket.id}`;
      socket.join(roomId);
      waitingUser.join(roomId);

      console.log(`🎲 Paired ${socket.id} with ${waitingUser.id} in ${roomId}`);
      io.to(roomId).emit('privateChatStarted', { roomId });

      waitingUser = null;
    } else {
      waitingUser = socket;
      console.log(`⌛ ${socket.id} is waiting for private chat`);
    }
  });

  // Send message in Private Chat
  socket.on('sendPrivateMessage', async ({ roomId, message, alias }) => {
    const newMessage = new Chat({ roomId, sender: alias, message });
    await newMessage.save();

    io.to(roomId).emit('receivePrivateMessage', newMessage);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (waitingUser && waitingUser.id === socket.id) {
      waitingUser = null;
    }
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
