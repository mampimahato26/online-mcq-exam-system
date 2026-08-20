import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Clock, Loader, AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

const TakeExam = () => {
  const { id } = useParams(); // Exam ID
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Stores answers: { questionId: 'A' }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // References to prevent interval issues
  const timerRef = useRef(null);
  const answersRef = useRef({});
  answersRef.current = answers;

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api.student.startExam(id);
        setExam(response.data);
        setQuestions(response.data.questions);
        setTimeLeft(response.data.duration * 60); // convert minutes to seconds
      } catch (err) {
        console.error('Error starting exam:', err);
        setError(err.response?.data?.message || 'Failed to start exam. Verify you are registered.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Start timer once exam details are fetched
  useEffect(() => {
    if (timeLeft > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            // Time expired: auto-submit immediately
            handleAutoSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [timeLeft]);

  // Auto-submit triggers when timer expires
  const handleAutoSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setSubmitting(true);
    setError('');

    // Force alert notifying student of auto submission
    alert('Time limit reached! Your answers will be automatically submitted.');

    try {
      const response = await api.student.submitExam(id, answersRef.current);
      const resultData = response.data.resultDetails;
      
      // Navigate to results screen with payload
      navigate(`/student/exams/${id}/result`, {
        state: { resultDetails: resultData, examTitle: exam?.title },
        replace: true
      });
    } catch (err) {
      console.error('Auto-submit error:', err);
      setError('An error occurred during automatic submission. Contact admin.');
      setSubmitting(false);
    }
  };

  // Manual submit trigger
  const handleManualSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setSubmitting(true);
    setShowConfirmModal(false);
    setError('');

    try {
      const response = await api.student.submitExam(id, answers);
      const resultData = response.data.resultDetails;

      navigate(`/student/exams/${id}/result`, {
        state: { resultDetails: resultData, examTitle: exam?.title },
        replace: true
      });
    } catch (err) {
      console.error('Manual submit error:', err);
      setError(err.response?.data?.message || 'Failed to submit exam.');
      setSubmitting(false);
      // Restart timer if submission failed
      setTimeLeft((prev) => {
        if (prev > 0) {
          timerRef.current = setInterval(() => {
            setTimeLeft(p => p - 1);
          }, 1000);
        }
        return prev;
      });
    }
  };

  // Option selection handler
  const handleOptionSelect = (optionLetter) => {
    if (submitting) return;
    const q = questions[currentIndex];
    setAnswers({
      ...answers,
      [q.id]: optionLetter
    });
  };

  // Format timeLeft into MM:SS
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      {/* Top Banner showing Title and Timer */}
      <div className="flex justify-between align-center flex-mobile-col" style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem 2rem',
        marginBottom: '2rem',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exam?.title}</h2>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Attempting 10 MCQ Questions
          </div>
        </div>

        <div className="flex align-center gap-2" style={{
          backgroundColor: timeLeft <= 60 ? 'var(--color-danger-light)' : 'var(--color-primary-light)',
          padding: '0.5rem 1.25rem',
          borderRadius: '8px',
          border: `1px solid ${timeLeft <= 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
        }}>
          <Clock size={20} className={timeLeft <= 60 ? 'timer-warn' : ''} style={{ color: timeLeft <= 60 ? 'var(--color-danger)' : 'var(--color-primary)' }} />
          <span className={`font-semibold ${timeLeft <= 60 ? 'timer-warn' : ''}`} style={{
            fontSize: '1.25rem',
            color: timeLeft <= 60 ? 'var(--color-danger)' : 'var(--color-primary-hover)',
            fontFamily: 'monospace'
          }}>
            {formatTime()}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {submitting ? (
        <div className="card text-center flex flex-column justify-center align-center" style={{ minHeight: '40vh', gap: '1rem' }}>
          <Loader size={48} className="animate-spin text-success" />
          <h2 style={{ fontWeight: 600 }}>Evaluating your answers...</h2>
          <p className="text-muted">Please wait while the server logs your grade and updates your transcript.</p>
        </div>
      ) : (
        <div className="exam-layout">
          {/* Main Question Panel */}
          <div className="card" style={{ padding: '2rem' }}>
            {/* Header info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.75rem'
            }}>
              <span className="badge badge-student" style={{ fontWeight: 600 }}>
                Question {currentIndex + 1} of 10
              </span>
              <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                Answered: <strong>{answeredCount}</strong> / 10
              </span>
            </div>

            {/* Question body */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              {currentQuestion?.question_text}
            </h3>

            {/* Options list */}
            <div style={{ marginBottom: '2.5rem' }}>
              {['A', 'B', 'C', 'D'].map((letter) => {
                const optKey = `option_${letter.toLowerCase()}`;
                const optionText = currentQuestion?.[optKey];
                const isSelected = answers[currentQuestion?.id] === letter;

                return (
                  <div
                    key={letter}
                    onClick={() => handleOptionSelect(letter)}
                    className={`question-option ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="option-letter">{letter}</span>
                    <span style={{ fontSize: '0.9375rem' }}>{optionText}</span>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex justify-between align-center border-top" style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem'
            }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              {currentIndex === 9 ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowConfirmModal(true)}
                  style={{ padding: '0.625rem 1.5rem' }}
                >
                  <CheckCircle size={16} />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Jump Navigation Grid */}
          <div className="flex flex-column gap-3">
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                Exam Navigation Grid
              </h3>
              
              <div className="question-grid">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isActive = idx === currentIndex;
                  
                  let btnClass = 'grid-btn';
                  if (isActive) btnClass += ' active';
                  else if (isAnswered) btnClass += ' answered';

                  return (
                    <button
                      key={q.id}
                      className={btnClass}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div className="flex align-center gap-1">
                  <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--color-success)' }} />
                  <span>Answered</span>
                </div>
                <div className="flex align-center gap-1">
                  <span style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1.5px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)' }} />
                  <span>Active Question</span>
                </div>
                <div className="flex align-center gap-1">
                  <span style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }} />
                  <span>Unattempted</span>
                </div>
              </div>
            </div>

            {/* Quick Helper guidelines */}
            <div className="card" style={{ padding: '1rem', borderLeft: '3px solid var(--color-warning)' }}>
              <div className="flex align-center gap-1 font-semibold" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                <ShieldAlert size={14} style={{ color: 'var(--color-warning)' }} />
                <span>Quick Advice</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Review all your questions before final submission. Click "Submit Exam" to calculate your results immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content text-center" style={{ maxWidth: '420px' }}>
            <AlertTriangle size={48} style={{ color: 'var(--color-warning)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submit Exam?</h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              You have answered <strong>{answeredCount}</strong> of 10 questions. Are you sure you want to finish and submit the exam?
            </p>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  // Restart timer if confirm cancelled
                  setTimeLeft((prev) => {
                    if (prev > 0) {
                      timerRef.current = setInterval(() => {
                        setTimeLeft(p => p - 1);
                      }, 1000);
                    }
                    return prev;
                  });
                }}
              >
                Go Back
              </button>
              
              <button
                type="button"
                className="btn btn-success"
                onClick={handleManualSubmit}
              >
                Yes, Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
