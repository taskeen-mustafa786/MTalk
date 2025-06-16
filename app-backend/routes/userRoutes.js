const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

router.get('/me', authenticateToken, getProfile);

module.exports = router;
