const Url = require('../models/Url');
const mongoose = require('mongoose');
const generateUniqueShortUrl = require('../helpers/generateUniqueShortUrl');
const redirectDomain = process.env.SERVER_DOMAIN || ("localhost:" + process.env.PORT + "/url/");
// All URL related controllers like createShortUrl, getUrls, redirectToLongUrl, etc.

exports.createShortUrl = async (req, res) => {
    const { longUrl, customShortUrl } = req.body;
    
    try {
      // Check if the customShortUrl is provided and unique
      if (customShortUrl) {
        if (customShortUrl.length < 8){
            return res.status(409).json({ message: 'Custom short URL already in use.' });
        }
        const existingUrl = await Url.findOne({ shortUrl: customShortUrl });
        if (existingUrl) {
            return res.status(400).json({ message: 'Custom url too short' });
        }
      }
  
      let shortUrl = customShortUrl;
      if (!shortUrl) {
        // Find the total count of URLs for determining the length of the random part
        shortUrl = await generateUniqueShortUrl();
      }
  
      let url = new Url({
        _id: new mongoose.Types.ObjectId(),
        longUrl,
        shortUrl: shortUrl,
        userId: req.user.userId
      });
  
      url = await url.save();
      url.shortUrl = redirectDomain + url.shortUrl;
      res.status(201).json(url);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.toString()});
    }
  };

exports.getUrlsByUser = async (req, res) => {
    try {
        const urls = await Url.find({ userId: req.user.userId });
        res.json(urls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.toString()});
    }
  };

exports.redirectToLongUrl = async (req, res) => {
    try {
      const url = await Url.findOne({ shortUrl: req.params.shortUrl });
      if (url) {
        res.redirect(url.longUrl);
      } else {
        res.status(404).json({ message: 'URL not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  };