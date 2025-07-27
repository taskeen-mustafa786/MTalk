const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const contactController = require('../controllers/contactController');

router.get('/saved-contacts', authenticateToken, contactController.getSavedContacts);
router.post('/add-by-email', authenticateToken, contactController.addContactByEmail);

module.exports = router;
