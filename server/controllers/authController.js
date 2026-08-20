const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: 'All fields are required.'
    });
  }

  // Valid roles
  const validRoles = ['admin', 'examiner', 'student'];
  const normalizedRole = role.toLowerCase().trim();

  if (!validRoles.includes(normalizedRole)) {
    return res.status(400).json({
      message: 'Invalid role selected.'
    });
  }

  try {
    // Check if email already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.trim()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'Email is already registered.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user with selected role
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [
        name.trim(),
        email.trim(),
        hashedPassword,
        normalizedRole
      ]
    );

    res.status(201).json({
      message: `${normalizedRole.charAt(0).toUpperCase() +
        normalizedRole.slice(1)
        } registered successfully!`,
      userId: result.insertId,
      role: normalizedRole
    });

  } catch (err) {
    console.error('Registration error:', err);

    res.status(500).json({
      message: 'Server error during registration.'
    });
  }
};


// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.'
    });
  }

  try {
    // Find user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET ||
      'mcq_exam_system_secret_key_2026',
      {
        expiresIn: '24h'
      }
    );

    // Send response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      message: 'Server error during login.'
    });
  }
};