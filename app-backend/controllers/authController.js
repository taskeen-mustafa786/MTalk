const User = require('../models/User');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Email or username already exists' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      username,
      email,
      password,
      verified: false,
      verificationToken,
      verificationExpires
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'Registration successful. Please check your email to verify.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
