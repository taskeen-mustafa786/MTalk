const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token malformed' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
