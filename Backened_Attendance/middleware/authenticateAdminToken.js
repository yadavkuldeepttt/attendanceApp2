const jwt = require('jsonwebtoken');

const authenticateAdminToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    
    req.admin = admin; // Store admin info for later use
    next(); // Call next middleware or route handler
  });
};

module.exports = { authenticateAdminToken };
