const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const users = require('../data/users');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.error('POST /auth/register 400: missing required fields');
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (users.find((u) => u.email === email)) {
    console.error(`POST /auth/register 409: email already registered (${email})`);
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = String(Date.now());
  const user = { userId, name, email, password: hash, likes: [] };
  users.push(user);

  res.status(201).json({ data: { userId, name, email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('POST /auth/login 400: missing required fields');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    console.error(`POST /auth/login 401: no account for ${email}`);
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.error(`POST /auth/login 401: wrong password for ${email}`);
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const token = jwt.sign(
    { userId: user.userId, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  res.json({
    data: {
      token,
      user: { userId: user.userId, name: user.name, email: user.email, likes: user.likes },
    },
  });
});

module.exports = router;
