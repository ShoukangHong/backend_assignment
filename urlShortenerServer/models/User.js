const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // This is created automatically by MongoDB
  userName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  tier: {
    type: Number,
    required: true,
    index: true, // Create an index if you'll often query users based on tier
  },
  requestCount: {
    type: Number,
    required: true,
    default: 0,
  },
  lastRequest: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
