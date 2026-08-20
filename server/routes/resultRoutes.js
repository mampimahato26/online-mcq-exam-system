const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorize } = require('../middleware/auth');

// Apply JWT authentication and student role check to all result history routes
router.use(verifyToken);
router.use(authorize('student'));

// Get logged-in student's history of results
router.get('/my-results', studentController.getMyResults);

module.exports = router;
