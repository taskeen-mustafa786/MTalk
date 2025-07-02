const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getConversations, getMessages, createConversation } = require('../controllers/coversationController'); // Fixed typo

router.get('/', authenticateToken, getConversations);
router.get('/:id/messages', authenticateToken, getMessages);
router.post('/', authenticateToken, createConversation);

module.exports = router;
