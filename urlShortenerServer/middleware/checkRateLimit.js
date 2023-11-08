const User = require('../models/User');

const rateLimitWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const tierLimits = {
  1: 10,
  2: 100,
  3: 1000,
};

async function checkRateLimit(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Reset request count if we're past the rate limit window
    if (Date.now() - user.lastRequest > rateLimitWindow) {
      user.requestCount = 0;
      user.lastRequest = Date.now();
    }

    if (user.requestCount >= tierLimits[user.tier]) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    // Increment request count and save
    user.requestCount += 1;
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = checkRateLimit;