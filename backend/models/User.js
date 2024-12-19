const mongoose = require('mongoose');

// User schema
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

// Chat message schema
const chatSchema = new mongoose.Schema({
  sender: String, // Alias or ID of the sender for anonymous chats
  message: String, // The chat message
  timestamp: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', chatSchema);

// Export both models
module.exports = {
  User,
  Chat,
};
