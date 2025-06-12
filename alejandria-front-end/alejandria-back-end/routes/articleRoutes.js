const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Article routes working!' });
});

// Basic routes without complex patterns
router.get('/', (req, res) => {
  res.json({ message: 'Get all articles - placeholder' });
});

router.get('/published', (req, res) => {
  res.json({ message: 'Get published articles - placeholder' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create article - placeholder' });
});

module.exports = router;