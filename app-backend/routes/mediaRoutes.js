const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File required' });
  }
  
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
