import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { HelpCircle, Save, Loader, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const AddQuestions = () => {
  const { id } = useParams(); // Exam ID
  const navigate = useNavigate();
  
  const [examTitle, setExamTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Navigation inside the questions (0 to 9 index)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize array of exactly 10 questions
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, () => ({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A'
    }))
  );

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await api.examiner.getExamById(id);
        setExamTitle(response.data.title);
        
        // If questions already exist (editing mode), load them
        if (response.data.questions && response.data.questions.length === 10) {
          setQuestions(response.data.questions);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load exam details. Make sure you are authorized.');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id]);

  const handleFieldChange = (field, value) => {
    const updated = [...questions];
    updated[currentIndex] = {
      ...updated[currentIndex],
      [field]: value
    };
    setQuestions(updated);
  };

  // Helper to check if a question index has been filled
  const isQuestionFilled = (index) => {
    const q = questions[index];
    return (
      q.question_text.trim() !== '' &&
      q.option_a.trim() !== '' &&
      q.option_b.trim() !== '' &&
      q.option_c.trim() !== '' &&
      q.option_d.trim() !== ''
    );
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Verify all 10 questions are completely filled
    for (let i = 0; i < 10; i++) {
      if (!isQuestionFilled(i)) {
        setCurrentIndex(i); // jump to the unfilled question
        return setError(`Please complete all fields for Question ${i + 1} before saving.`);
      }
    }

    setSaving(true);
    try {
      await api.examiner.addQuestions(id, questions);
      setSuccess('All 10 questions saved successfully! Redirecting to my exams...');
      setTimeout(() => {
        navigate('/examiner/exams');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save questions. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Set MCQ Questions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Exam: <strong>{examTitle}</strong> (Requires exactly 10 questions)</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-banner alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '2rem'
      }} className="flex-mobile-col">
        {/* Left Navigator Panel */}
        <div className="card" style={{ padding: '1rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            Question Tracker
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {questions.map((_, idx) => {
              const filled = isQuestionFilled(idx);
              const active = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '6px',
                    border: '1px solid transparent',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left',
                    width: '100%',
                    backgroundColor: active 
                      ? 'var(--color-primary-light)' 
                      : 'transparent',
                    color: active 
                      ? 'var(--color-primary-hover)' 
                      : 'var(--text-primary)',
                    borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent'
                  }}
                >
                  <span>Question {idx + 1}</span>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: filled ? 'var(--color-success)' : 'var(--text-light)'
                  }} />
                </button>
              );
            })}
          </div>

          <button 
            className="btn btn-success" 
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '6px' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Exam</span>
          </button>
        </div>

        {/* Right Editor Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <div className="flex justify-between align-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle style={{ color: 'var(--color-primary)' }} />
              <span>Editing Question {currentIndex + 1} of 10</span>
            </h2>
            
            <div className="flex gap-1">
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.6rem' }}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.6rem' }}
                disabled={currentIndex === 9}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="q-text">Question Text</label>
              <textarea
                id="q-text"
                className="form-control"
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="Enter the question query details here..."
                value={currentQ.question_text}
                onChange={(e) => handleFieldChange('question_text', e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="opt-a">Option A</label>
                <input
                  id="opt-a"
                  type="text"
                  className="form-control"
                  placeholder="First choice"
                  value={currentQ.option_a}
                  onChange={(e) => handleFieldChange('option_a', e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="opt-b">Option B</label>
                <input
                  id="opt-b"
                  type="text"
                  className="form-control"
                  placeholder="Second choice"
                  value={currentQ.option_b}
                  onChange={(e) => handleFieldChange('option_b', e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="opt-c">Option C</label>
                <input
                  id="opt-c"
                  type="text"
                  className="form-control"
                  placeholder="Third choice"
                  value={currentQ.option_c}
                  onChange={(e) => handleFieldChange('option_c', e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="opt-d">Option D</label>
                <input
                  id="opt-d"
                  type="text"
                  className="form-control"
                  placeholder="Fourth choice"
                  value={currentQ.option_d}
                  onChange={(e) => handleFieldChange('option_d', e.target.value)}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label className="form-label" htmlFor="correct-ans">Correct Answer</label>
              <select
                id="correct-ans"
                className="form-control"
                value={currentQ.correct_answer}
                onChange={(e) => handleFieldChange('correct_answer', e.target.value)}
                required
                disabled={saving}
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
