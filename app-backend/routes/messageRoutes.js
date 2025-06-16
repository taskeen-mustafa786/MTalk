const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { sendMessage } = require('../controllers/messageController');

router.post('/', authenticateToken, sendMessage);

module.exports = router;
