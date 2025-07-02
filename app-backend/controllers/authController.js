const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = async (user, req) => {
  const token = user.verificationToken;
  const url = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      username,
      email,
      password: hashedPassword,
      displayName,
      verificationToken,
    });

    await user.save();
    await sendVerificationEmail(user, req);

    res.status(201).json({ message: 'Registration successful. Check your email to verify.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.query.token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send('<h2>Email verified! You can now log in.</h2>');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        isVerified: user.verified,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
