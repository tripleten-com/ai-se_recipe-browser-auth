const express = require('express');
const verifyToken = require('../middleware/auth');
const users = require('../data/users');

const router = express.Router();

router.get('/me', verifyToken, (req, res) => {
  const user = users.find((u) => u.userId === req.user.userId);
  if (!user) {
    console.error(`GET /users/me 404: user ${req.user.userId} not found`);
    return res.status(404).json({ message: 'User not found' });
  }
  const { userId, name, email, likes } = user;
  res.json({ data: { userId, name, email, likes } });
});

module.exports = router;
