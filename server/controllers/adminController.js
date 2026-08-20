const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get admin dashboard stats (counts)
exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ count: studentsCount }]] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const [[{ count: examinersCount }]] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'examiner'");
    const [[{ count: examsCount }]] = await db.execute("SELECT COUNT(*) as count FROM exams");
    const [[{ count: resultsCount }]] = await db.execute("SELECT COUNT(*) as count FROM results");

    res.json({
      studentsCount,
      examinersCount,
      examsCount,
      resultsCount
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Server error fetching dashboard statistics.' });
  }
};

// Get list of all users (students and examiners)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE role IN (?, ?) ORDER BY role, name',
      ['student', 'examiner']
    );
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users list.' });
  }
};

// Create a new user (admin can add examiner or student directly)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!['student', 'examiner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully!`,
      userId: result.insertId
    });
  } catch (err) {
    console.error('Error creating user by admin:', err);
    res.status(500).json({ message: 'Server error creating user.' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const [users] = await db.execute('SELECT role FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (users[0].role === 'admin') {
      return res.status(400).json({ message: 'Admin account cannot be deleted.' });
    }

    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};

// Get all exams with examiner name
exports.getExams = async (req, res) => {
  try {
    const [exams] = await db.execute(`
      SELECT e.id, e.title, e.duration, e.created_at, u.name as examiner_name 
      FROM exams e 
      JOIN users u ON e.examiner_id = u.id 
      ORDER BY e.created_at DESC
    `);
    res.json(exams);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ message: 'Server error fetching exams list.' });
  }
};

// Get all student results with names and exam titles
exports.getResults = async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT r.id, r.score, r.correct_answers, r.wrong_answers, r.percentage, r.submitted_at,
             u.name as student_name, u.email as student_email, e.title as exam_title 
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN exams e ON r.exam_id = e.id
      ORDER BY r.submitted_at DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error fetching results list.' });
  }
};
