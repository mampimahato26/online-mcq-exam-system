const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify if a user is authenticated using JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'mcq_exam_system_secret_key_2026');
    req.user = verified; // Attach user payload (id, email, role) to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to verify if a user has one of the allowed roles
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
    }

    next();
  };
};

module.exports = { verifyToken, authorize };
