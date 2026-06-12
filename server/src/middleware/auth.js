const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.error(`${req.method} ${req.path} 401: no token provided`);
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.error(`${req.method} ${req.path} 401: ${err.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;