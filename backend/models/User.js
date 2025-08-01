const mongoose = require('mongoose');

// 1️⃣ User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// 2️⃣ Public message schema
const PublicMessageSchema = new mongoose.Schema({
  sender: String, // Alias or anonymous
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// 3️⃣ Private message schema
const PrivateMessageSchema = new mongoose.Schema({
  roomId: String, // Room identifier
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// Models
const User = mongoose.model('User', UserSchema);
const PublicMessage = mongoose.model('PublicMessage', PublicMessageSchema);
const PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);

// Export all
module.exports = {
  User,
  PublicMessage,
  PrivateMessage,
};
