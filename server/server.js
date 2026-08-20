const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with default settings (allow all origins in development)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root simple message route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online MCQ Exam System REST API.' });
});

// Register api route handlers
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Endpoint not found.' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred.' });
});

// Start listening for client requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
