const db = require('../config/db');

// Create a new exam (examiner)
exports.createExam = async (req, res) => {
  const { title, duration } = req.body;
  const examinerId = req.user.id;

  if (!title || !duration) {
    return res.status(400).json({ message: 'Exam title and duration are required.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO exams (title, duration, examiner_id) VALUES (?, ?, ?)',
      [title, duration, examinerId]
    );

    res.status(201).json({
      message: 'Exam created successfully! Now add questions.',
      examId: result.insertId
    });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ message: 'Server error creating exam.' });
  }
};

// Add questions to an exam (must be exactly 10 MCQ questions)
exports.addQuestions = async (req, res) => {
  const { id } = req.params; // exam ID
  const { questions } = req.body; // Array of 10 questions

  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Questions must be sent as an array.' });
  }

  if (questions.length !== 10) {
    return res.status(400).json({ message: 'An exam must contain exactly 10 questions.' });
  }

  // Validate fields for each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (
      !q.question_text ||
      !q.option_a ||
      !q.option_b ||
      !q.option_c ||
      !q.option_d ||
      !q.correct_answer
    ) {
      return res.status(400).json({ message: `Question ${i + 1} is missing required fields.` });
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correct_answer.toUpperCase())) {
      return res.status(400).json({ message: `Question ${i + 1} has an invalid correct answer (must be A, B, C, or D).` });
    }
  }

  // Connect pool and perform transaction
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Verify exam ownership
    const [exams] = await connection.execute(
      'SELECT id FROM exams WHERE id = ? AND examiner_id = ?',
      [id, req.user.id]
    );

    if (exams.length === 0) {
      connection.release();
      return res.status(403).json({ message: 'You are not authorized to manage this exam.' });
    }

    // Clear existing questions for this exam
    await connection.execute('DELETE FROM questions WHERE exam_id = ?', [id]);

    // Insert new 10 questions
    const query = `
      INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (const q of questions) {
      await connection.execute(query, [
        id,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer.toUpperCase()
      ]);
    }

    await connection.commit();
    connection.release();

    res.status(201).json({ message: 'Exactly 10 questions saved successfully to the database!' });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error('Error saving questions:', err);
    res.status(500).json({ message: 'Server error saving exam questions.' });
  }
};

// Get list of exams created by the logged-in examiner
exports.getMyExams = async (req, res) => {
  const examinerId = req.user.id;

  try {
    const [exams] = await db.execute(`
      SELECT e.id, e.title, e.duration, e.created_at, COUNT(q.id) as question_count 
      FROM exams e 
      LEFT JOIN questions q ON e.id = q.exam_id 
      WHERE e.examiner_id = ? 
      GROUP BY e.id 
      ORDER BY e.created_at DESC
    `, [examinerId]);

    res.json(exams);
  } catch (err) {
    console.error('Error fetching examiner exams:', err);
    res.status(500).json({ message: 'Server error fetching your exams.' });
  }
};

// Get exam details (with questions for editing/previewing - only allowed for creator examiner or admin)
exports.getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const [exams] = await db.execute('SELECT * FROM exams WHERE id = ?', [id]);
    if (exams.length === 0) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const exam = exams[0];

    // Check ownership (only examiner who created or admin can see full exam with correct answers directly via this endpoint)
    if (exam.examiner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const [questions] = await db.execute('SELECT * FROM questions WHERE exam_id = ?', [id]);

    res.json({
      ...exam,
      questions
    });
  } catch (err) {
    console.error('Error fetching exam details:', err);
    res.status(500).json({ message: 'Server error fetching exam details.' });
  }
};

// Get results for a specific exam (examiner)
exports.getExamResults = async (req, res) => {
  const { id } = req.params; // exam ID

  try {
    // Verify exam ownership first
    const [exams] = await db.execute(
      'SELECT id, title FROM exams WHERE id = ? AND examiner_id = ?',
      [id, req.user.id]
    );

    if (exams.length === 0) {
      return res.status(403).json({ message: 'You are not authorized to view results for this exam.' });
    }

    const [results] = await db.execute(`
      SELECT r.id, r.score, r.correct_answers, r.wrong_answers, r.percentage, r.submitted_at,
             u.name as student_name, u.email as student_email 
      FROM results r 
      JOIN users u ON r.student_id = u.id 
      WHERE r.exam_id = ? 
      ORDER BY r.submitted_at DESC
    `, [id]);

    res.json({
      examTitle: exams[0].title,
      results
    });
  } catch (err) {
    console.error('Error fetching exam results:', err);
    res.status(500).json({ message: 'Server error fetching exam results.' });
  }
};
