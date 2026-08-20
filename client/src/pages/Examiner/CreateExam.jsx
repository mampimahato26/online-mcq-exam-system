import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FileText, ArrowRight, Loader, AlertCircle } from 'lucide-react';

const CreateExam = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      return setError('Please enter a valid exam title.');
    }

    const durationVal = parseInt(duration);
    if (isNaN(durationVal) || durationVal <= 0) {
      return setError('Please enter a valid positive number for duration (minutes).');
    }

    setLoading(true);
    try {
      const response = await api.examiner.createExam({
        title: title.trim(),
        duration: durationVal
      });
      const { examId } = response.data;
      // Redirect to add questions page for this new exam
      navigate(`/examiner/exams/${examId}/questions`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create New Exam</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Set up exam metadata before adding the questions.</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="exam-title">Exam Title</label>
            <input
              id="exam-title"
              type="text"
              className="form-control"
              placeholder="e.g., Computer Science Basics - Quiz 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="exam-duration">Exam Duration (in Minutes)</label>
            <input
              id="exam-duration"
              type="number"
              className="form-control"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              disabled={loading}
            />
            <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.4rem' }}>
              The countdown timer will limit testing to this duration during student attempts.
            </small>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/examiner/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Next: Add Questions</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
