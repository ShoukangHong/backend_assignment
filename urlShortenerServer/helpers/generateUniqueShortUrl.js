const Url = require('../models/Url');

async function generateUniqueShortUrl() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const totalUrls = await Url.countDocuments();
  const length = Math.max(8, totalUrls.toString().length);
  let shortUrl;
  let existingUrl;
  do {
    shortUrl = "";
    for (let i = 0; i < length; i++) {
      shortUrl += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    existingUrl = await Url.findOne({ shortUrl });
  } while (existingUrl);
  return shortUrl;
}

module.exports = generateUniqueShortUrl;