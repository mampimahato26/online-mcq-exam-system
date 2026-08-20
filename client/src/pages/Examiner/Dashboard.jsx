import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, FilePlus, Award, Loader, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyExams = async () => {
      try {
        const response = await api.examiner.getMyExams();
        setExams(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your exams.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyExams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  // Count active exams that have exactly 10 questions seeded
  const activeExamsCount = exams.filter(e => e.question_count === 10).length;
  const draftExamsCount = exams.filter(e => e.question_count < 10).length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Examiner Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure examinations, add MCQs, and review student grades.</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Exams</div>
            <div className="stat-number">{exams.length}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Exams (10 Qs)</div>
            <div className="stat-number">{activeExamsCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <FilePlus size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Draft Exams (Pending Qs)</div>
            <div className="stat-number">{draftExamsCount}</div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="grid grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '1.5rem' }}>
          <div>
            <h2 className="card-title">Setup New Exams</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Quickly create exams by entering a title and setting a duration timer. Each exam requires exactly 10 multiple-choice questions to become visible to students.
            </p>
          </div>
          <Link to="/examiner/create-exam" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <FilePlus size={16} />
            <span>Create New Exam</span>
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">My Recent Exams</h2>
          {exams.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No exams created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {exams.slice(0, 3).map(exam => (
                <div key={exam.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exam.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{exam.duration} mins • {exam.question_count} / 10 questions</div>
                  </div>
                  <Link to={`/examiner/exams/${exam.id}/results`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                    Results
                  </Link>
                </div>
              ))}
              <Link to="/examiner/exams" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
                View All Exams →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
