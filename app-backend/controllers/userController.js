const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ id: user._id, username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl, status: user.status, online: user.online, lastSeen: user.lastSeen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProfile };
