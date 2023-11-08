require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const urlRoutes = require('./routes/url');

const app = express();
app.use(express.urlencoded({ extended: true }));

const mongoDB = process.env.URL_SHORTENER_DB_URL; // This should be your MongoDB URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

app.use("/user", userRoutes);
app.use("/", urlRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
