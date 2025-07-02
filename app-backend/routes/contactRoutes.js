// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { getSavedContacts, addContact } = require('../controllers/contactController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/saved-contacts', authenticateToken, getSavedContacts);
router.post('/add', authenticateToken, addContact);

module.exports = router;
