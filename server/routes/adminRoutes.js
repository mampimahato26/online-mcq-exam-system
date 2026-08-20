const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/auth');

// Apply JWT authentication and Admin role check to all admin routes
router.use(verifyToken);
router.use(authorize('admin'));

// Stats dashboard
router.get('/stats', adminController.getDashboardStats);

// Manage users (examiners and students)
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);

// View all exams
router.get('/exams', adminController.getExams);

// View all results
router.get('/results', adminController.getResults);

module.exports = router;
