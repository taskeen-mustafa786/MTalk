const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// ✅ Correct import
const conversationController = require('../controllers/coversationController');

// Routes
router.get('/', authenticateToken, conversationController.getConversations);
router.get('/:id/messages', authenticateToken, conversationController.getMessages);
router.post('/', authenticateToken, conversationController.createConversation);
router.post('/start', authenticateToken, conversationController.startConversation);

module.exports = router;
