const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working!' });
});

// Basic routes without complex patterns
router.get('/', (req, res) => {
  res.json({ message: 'Get all users - placeholder' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create user - placeholder' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login - placeholder' });
});

module.exports = router;