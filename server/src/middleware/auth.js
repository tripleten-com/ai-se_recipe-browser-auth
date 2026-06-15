const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function verifyToken(req, res, next) {
  const token = req.cookies["auth-token"];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.error(`${req.method} ${req.path} 401: ${err.message}`);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
