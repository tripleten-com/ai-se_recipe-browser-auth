const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Seeded test account — credentials are in the project README.
const users = [
  {
    userId: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$mPuGaLpsizgVT4T0K4r.tuHv5WGKob0USGyPNawCO58cCewumeHbK',
  },
];

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = String(Date.now());
  const user = { userId, name, email, password: hash };
  users.push(user);

  res.status(201).json({ data: { userId, name, email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const token = jwt.sign(
    { userId: user.userId, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  res.json({ data: { token, user: { userId: user.userId, name: user.name, email: user.email } } });
});

router.get('/me', verifyToken, (req, res) => {
  const { userId, name, email } = req.user;
  res.json({ data: { userId, name, email } });
});

module.exports = router;