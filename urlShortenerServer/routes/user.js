const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
    // Invalidate the token by adding it to a blacklist, or simply let it expire
    res.json({ message: 'connected' });
  });

// 1. Create a new user
router.post('/signup', userController.signup);

// 2. Login
router.post('/login', userController.login);

// 3. Logout (Frontend should handle the token deletion, backend just invalidates if necessary)
router.post('/logout', userController.logout);

// 6. Update user tier
router.patch('/updateTier', authenticateToken, userController.updateTier);

module.exports = router;