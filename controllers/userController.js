const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// All user related controllers like signup, login, upgradeTier, etc.
exports.signup = async (req, res) => {
  const { userName, password } = req.body;
  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName: userName,
      encryptedPassword: hashedPassword,
      tier: 1 // default tier
    });
    console.log(user);
    user = await user.save();
    console.log(user);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res.status(201).json({ "userId": user._id, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString()});
  }
};

exports.login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    let user = await User.findOne({ userName: userName });
    if (user && await bcrypt.compare(password, user.encryptedPassword)) {
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString()});
  }
};

exports.logout = (req, res) => {
  // Invalidate the token by adding it to a blacklist, or simply let it expire
  res.json({ message: 'User logged out successfully' });
};

exports.updateTier = async (req, res) => {
  const { tier } = req.body; // assuming the new tier is passed in the request body
  try {
    if (isNaN(tier) || Number(tier) <= 0 || Number(tier) > 3) {
      return res.status(400).json({ message: 'Invalid tier value provided.' });
    }
    const user = await User.findByIdAndUpdate(req.user.userId, { tier: tier }, { new: true }); // update the tier and return the updated document
    // You might want to check if the user was found and updated successfully
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Tier updated successfully', newTier: user.tier });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString()});
  }
};
