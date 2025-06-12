const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Test route (keep for debugging)
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working!' });
});

// Real user routes
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;