const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: { // this is the field for storing the shortened part of the URL
    type: String,
    required: true,
    index: true, // Efficiently get the long url with the short url provided.
    unique: true // ensures that all short codes are unique
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, // Efficiently query all URLs for a given user
    ref: 'User' // Creates a reference to User
  }
});

module.exports = mongoose.model('Url', urlSchema);