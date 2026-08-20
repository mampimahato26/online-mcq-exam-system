const db = require('../config/db');

// Get available exams for students (must have exactly 10 questions)
exports.getAvailableExams = async (req, res) => {
  try {
    const [exams] = await db.execute(`
      SELECT 
        e.id,
        e.title,
        e.duration,
        u.name AS examiner_name,
        COUNT(q.id) AS question_count
      FROM exams e
      JOIN users u ON e.examiner_id = u.id
      LEFT JOIN questions q ON e.id = q.exam_id
      GROUP BY e.id
      HAVING question_count = 10
      ORDER BY e.created_at DESC
    `);

    res.json(exams);
  } catch (err) {
    console.error('Error fetching available exams:', err);

    res.status(500).json({
      message: 'Server error fetching exams.'
    });
  }
};


// Start an exam: Send questions to the client WITHOUT correct answers
exports.startExam = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if exam exists
    const [exams] = await db.execute(
      'SELECT * FROM exams WHERE id = ?',
      [id]
    );

    if (exams.length === 0) {
      return res.status(404).json({
        message: 'Exam not found.'
      });
    }

    const exam = exams[0];

    // Get questions without correct answers
    const [questions] = await db.execute(
      `SELECT
        id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d
      FROM questions
      WHERE exam_id = ?`,
      [id]
    );

    if (questions.length !== 10) {
      return res.status(400).json({
        message:
          'This exam is not ready yet. It must contain exactly 10 questions.'
      });
    }

    res.json({
      id: exam.id,
      title: exam.title,
      duration: exam.duration,
      questions
    });

  } catch (err) {
    console.error('Error starting exam:', err);

    res.status(500).json({
      message: 'Server error starting exam.'
    });
  }
};


// Submit exam and auto-evaluate results
exports.submitExam = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;
  const studentId = req.user.id;

  // Check answers
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({
      message: 'Invalid format. Answers are required.'
    });
  }

  try {
    // 1. Check if exam exists
    const [exams] = await db.execute(
      'SELECT * FROM exams WHERE id = ?',
      [id]
    );

    if (exams.length === 0) {
      return res.status(404).json({
        message: 'Exam not found.'
      });
    }


    // 2. Fetch questions and correct answers
    const [questions] = await db.execute(
      `SELECT
        id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      FROM questions
      WHERE exam_id = ?`,
      [id]
    );

    if (questions.length !== 10) {
      return res.status(400).json({
        message: 'Invalid exam state.'
      });
    }


    let correctCount = 0;
    let wrongCount = 0;

    // Store question-wise evaluation
    const evaluation = [];


    // 3. Evaluate each question
    questions.forEach((q, index) => {

      const questionId = q.id.toString();

      // Student selected answer
      const studentAnswer =
        answers[questionId] ||
        answers[q.id] ||
        'Not Answered';


      // Check if correct
      const isCorrect =
        studentAnswer !== 'Not Answered' &&
        studentAnswer.toString().toUpperCase() ===
          q.correct_answer.toString().toUpperCase();


      // Count correct and wrong answers
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }


      // Store complete evaluation
      evaluation.push({
        questionId: q.id,
        questionNumber: index + 1,

        question: q.question_text,

        options: {
          A: q.option_a,
          B: q.option_b,
          C: q.option_c,
          D: q.option_d
        },

        studentAnswer: studentAnswer,
        correctAnswer: q.correct_answer,

        isCorrect: isCorrect
      });
    });


    // 4. Calculate score
    const totalQuestions = 10;

    const score = correctCount;

    const percentage =
      (score / totalQuestions) * 100;


    // 5. Store overall result in database
    const [result] = await db.execute(
      `INSERT INTO results
      (
        student_id,
        exam_id,
        score,
        correct_answers,
        wrong_answers,
        percentage
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        id,
        score,
        correctCount,
        wrongCount,
        percentage
      ]
    );


    // 6. Send result and question-wise evaluation to frontend
    res.status(201).json({

      message: 'Exam submitted successfully!',

      resultId: result.insertId,

      resultDetails: {

        examId: parseInt(id),

        score: score,

        correctAnswers: correctCount,

        wrongAnswers: wrongCount,

        percentage: percentage,

        submittedAt: new Date(),

        // Question-wise evaluation
        evaluation: evaluation
      }
    });

  } catch (err) {

    console.error('Error submitting exam:', err);

    res.status(500).json({
      message: 'Server error saving exam results.'
    });
  }
};


// Get results history for logged-in student
exports.getMyResults = async (req, res) => {
  const studentId = req.user.id;

  try {

    const [results] = await db.execute(
      `
      SELECT
        r.id,
        r.score,
        r.correct_answers,
        r.wrong_answers,
        r.percentage,
        r.submitted_at,
        e.title AS exam_title,
        e.duration

      FROM results r

      JOIN exams e
      ON r.exam_id = e.id

      WHERE r.student_id = ?

      ORDER BY r.submitted_at DESC
      `,
      [studentId]
    );

    res.json(results);

  } catch (err) {

    console.error(
      'Error fetching student results:',
      err
    );

    res.status(500).json({
      message:
        'Server error fetching result history.'
    });
  }
};