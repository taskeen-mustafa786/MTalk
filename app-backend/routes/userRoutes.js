const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile, updateStatus, getContacts, updateAvatar } = require('../controllers/userController');

// Get current user profile
router.get('/me', authenticateToken, getProfile);

// Update user profile (displayName, etc.)
router.patch('/me', authenticateToken, updateProfile);

// Update user status
router.patch('/me/status', authenticateToken, updateStatus);

// Update user avatar
router.patch('/me/avatar', authenticateToken, updateAvatar);

// Get user's contacts (non-group conversations)
router.get('/me/contacts', authenticateToken, getContacts);

// Search users by username/displayName (for adding to chats)
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude current user
    }).select('username displayName avatarUrl status online');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
