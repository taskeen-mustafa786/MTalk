// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log('⛔ Missing Authorization header');
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('⛔ Bearer token missing');
    return res.status(401).json({ message: 'Token malformed' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('⛔ Token verification failed:', err.message);
      return res.status(403).json({ message: 'Token invalid' });
    }

    console.log('✅ Token verified. User ID:', decoded.id);
    req.user = { id: decoded.id }; // 👈 Important: attaches user.id
    next();
  });
}

module.exports = authenticateToken;
