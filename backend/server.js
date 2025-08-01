const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { OAuth2Client } = require('google-auth-library');
const { User, PublicMessage, PrivateMessage } = require('./models/User');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// Google OAuth2 client
const client = new OAuth2Client(process.env.CLIENT_ID);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Login Route
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

    // Restrict to specific domains if provided
    if (process.env.ALLOWED_DOMAINS) {
      const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');
      const isAllowed = allowedDomains.some(domain => googleEmail.endsWith(domain.trim()));
      if (!isAllowed) {
        return res.status(403).json({ message: 'Access denied. Email domain not authorized.' });
      }
    }

    let user = await User.findOne({ email: googleEmail });
    if (!user) {
      user = new User({ name: payload.name, email: googleEmail });
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// WebSocket Logic
let waitingUser = null;

io.on('connection', (socket) => {
  console.log('📡 User connected:', socket.id);
  let userAlias;

  // Join Public Chat Room
  socket.on('joinPublicChat', async (alias) => {
    userAlias = alias;
    socket.join('campusPublic');

    const chatHistory = await PublicMessage.find().sort({ timestamp: 1 });
    socket.emit('chatHistory', chatHistory);

    console.log(`👥 ${alias} joined campusPublic`);
  });

  // Public Message
  socket.on('sendPublicMessage', async ({ message, alias }) => {
    const newMessage = new PublicMessage({ sender: alias, message });
    await newMessage.save();

    console.log(`[Public] ${alias}: ${message}`);
    io.to('campusPublic').emit('receivePublicMessage', newMessage);
  });

  // Private Chat Room (1-to-1 anonymous)
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

  // Private Message
  socket.on('sendPrivateMessage', async ({ roomId, message, alias }) => {
    const newMessage = new PrivateMessage({ roomId, sender: alias, message });
    await newMessage.save();

    console.log(`[Private] (${roomId}) ${alias}: ${message}`);
    io.to(roomId).emit('receivePrivateMessage', newMessage);
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (waitingUser && waitingUser.id === socket.id) {
      waitingUser = null;
    }
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
