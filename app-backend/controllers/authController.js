const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateJWT } = require('../utils/jwt');

async function register(req, res) {
  try {
    const { username, displayName, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    const passwordHash = await hashPassword(password);
    const newUser = new User({ username, displayName: displayName || username, passwordHash });
    await newUser.save();

    return res.json({ token: generateJWT(newUser), user: { id: newUser._id, username, displayName: newUser.displayName, avatarUrl: newUser.avatarUrl } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid username or password' });

    return res.json({ token: generateJWT(user), user: { id: user._id, username, displayName: user.displayName, avatarUrl: user.avatarUrl } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
