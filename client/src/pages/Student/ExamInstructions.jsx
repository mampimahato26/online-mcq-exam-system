import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldAlert, BookOpen, Clock, Play, Loader, ChevronLeft } from 'lucide-react';

const ExamInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        // Start returns questions but we can use it to fetch the general details (title, duration)
        const response = await api.student.startExam(id);
        setExam(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load exam details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="alert-banner alert-error">
          <ShieldAlert size={18} />
          <span>{error || 'Exam could not be loaded.'}</span>
        </div>
        <Link to="/student/exams" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Back to Exams
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/student/exams" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', marginBottom: '1rem', borderRadius: '6px' }}>
          <ChevronLeft size={16} />
          <span>Back to Exams</span>
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Exam Instructions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Please read the code of conduct carefully before starting.</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Exam Title</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{exam.title}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Allowed Duration</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem', display: 'flex', alignCenter: 'center', gap: '0.25rem' }}>
              <Clock size={18} style={{ color: 'var(--color-primary)' }} />
              <span>{exam.duration} Minutes</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Important Regulations</h3>
          <ul style={{
            paddingLeft: '1.25rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.8,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <li>This exam consists of exactly <strong>10 multiple-choice questions</strong>.</li>
            <li>Each question carries <strong>1 mark</strong>. There is <strong>no negative marking</strong> for incorrect responses.</li>
            <li>The countdown timer starts immediately once you click the <strong>"Begin Exam Attempt"</strong> button.</li>
            <li><strong>Auto-Submission:</strong> Once the timer hits <code>00:00</code>, your exam will be automatically locked and submitted to the server immediately.</li>
            <li>Do not refresh or close the browser tab during the attempt, as your current answers will be lost.</li>
            <li>Ensure you have a stable internet connection before beginning.</li>
          </ul>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--color-warning-light)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          gap: '0.75rem',
          color: 'var(--text-primary)',
          fontSize: '0.875rem'
        }}>
          <ShieldAlert size={20} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Disclaimer:</strong> You cannot pause or resume this exam. Once started, the timer runs continuously.
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem'
        }}>
          <input
            id="instructions-agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="instructions-agree" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
            I agree to the college rules and guidelines and am ready to start the exam.
          </label>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/student/exams/${id}/take`)}
            className="btn btn-success"
            style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', borderRadius: '8px' }}
            disabled={!agreed}
          >
            <Play size={18} />
            <span>Begin Exam Attempt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;
