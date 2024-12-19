const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
