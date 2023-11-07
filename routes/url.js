const express = require('express');
const urlController = require('../controllers/urlController');
const authenticateToken = require('../middleware/authenticateToken');
const checkRateLimit = require('../middleware/checkRateLimit');

const router = express.Router();

// 4. Get all short URLs for a user
router.get('/history', authenticateToken, checkRateLimit, urlController.getUrlsByUser);

// 5. Create a short URL
// 5. Create or custom a short URL
router.post('/', authenticateToken, checkRateLimit, urlController.createShortUrl);

// 7. Redirect to the long URL
router.get('/:shortUrl', urlController.redirectToLongUrl);

module.exports = router;