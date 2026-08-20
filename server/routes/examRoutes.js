const express = require('express');
const router = express.Router();
const examinerController = require('../controllers/examinerController');
const studentController = require('../controllers/studentController');
const { verifyToken, authorize } = require('../middleware/auth');

// All exam routes require authentication
router.use(verifyToken);

// === Student Exam Routes ===
// Get available exams for students
router.get('/', authorize('student'), studentController.getAvailableExams);
// Start an exam (get questions without correct answers)
router.post('/:id/start', authorize('student'), studentController.startExam);
// Submit exam answers (evaluate and save)
router.post('/:id/submit', authorize('student'), studentController.submitExam);

// === Examiner Exam Routes ===
// Create a new exam
router.post('/', authorize('examiner'), examinerController.createExam);
// Get exams created by the logged-in examiner
router.get('/my-exams', authorize('examiner'), examinerController.getMyExams);
// Get questions for a specific exam (examiner/admin only)
router.get('/:id', authorize(['examiner', 'admin']), examinerController.getExamById);
// Save questions for an exam (must be exactly 10 questions)
router.post('/:id/questions', authorize('examiner'), examinerController.addQuestions);
// Get results for an examiner's exam
router.get('/:id/results', authorize('examiner'), examinerController.getExamResults);

module.exports = router;
