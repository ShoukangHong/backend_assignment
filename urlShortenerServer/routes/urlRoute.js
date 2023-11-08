const express = require('express');
const urlController = require('../controllers/urlController');
const authenticateToken = require('../middleware/authenticateToken');
const checkRateLimit = require('../middleware/checkRateLimit');

const router = express.Router();

// Get all short URLs for a user.
router.get('/url/history', authenticateToken, checkRateLimit, urlController.getUrlsByUser);

// Create a short URL
// Create or custom a short URL
router.post('/url', authenticateToken, checkRateLimit, urlController.createShortUrl);

// Redirect to the long URL
router.get('/r/:shortUrl', urlController.redirectToLongUrl);

module.exports = router;