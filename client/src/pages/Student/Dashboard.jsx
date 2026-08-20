import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, Award, CheckCircle, Clock, Loader } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [resultsRes, examsRes] = await Promise.all([
          api.student.getMyResults(),
          api.student.getAvailableExams()
        ]);
        setResults(resultsRes.data);
        setAvailableExams(examsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  // Calculate Average Percentage
  const avgPercentage = results.length > 0
    ? (results.reduce((acc, r) => acc + parseFloat(r.percentage), 0) / results.length).toFixed(2)
    : '0.00';

  // Calculate Passed Exams (Score >= 5)
  const passedCount = results.filter(r => r.score >= 5).length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student Portal</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{currentUser.name}</strong>. Access your tests and review scores here.</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Available Exams</div>
            <div className="stat-number">{availableExams.length}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Exams Attempted</div>
            <div className="stat-number">{results.length}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Average Grade</div>
            <div className="stat-number">{avgPercentage}%</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Exams Passed</div>
            <div className="stat-number">{passedCount}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Available Exams Quick List */}
        <div className="card">
          <h2 className="card-title">Pending MCQ Exams</h2>
          {availableExams.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No exams available to attempt right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {availableExams.slice(0, 3).map(exam => {
                const alreadyTaken = results.some(r => r.exam_id === exam.id);
                return (
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span className="flex align-center gap-1">
                          <Clock size={12} />
                          {exam.duration} mins • By {exam.examiner_name}
                        </span>
                      </div>
                    </div>
                    {alreadyTaken ? (
                      <span className="badge badge-student" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', fontSize: '0.75rem' }}>
                        Attempted
                      </span>
                    ) : (
                      <Link to={`/student/exams/${exam.id}/instructions`} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Take Test
                      </Link>
                    )}
                  </div>
                );
              })}
              <Link to="/student/exams" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
                Browse All Exams →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Performance summary */}
        <div className="card">
          <h2 className="card-title">Recent Grade Submissions</h2>
          {results.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have not submitted any tests yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.slice(0, 3).map(res => (
                <div key={res.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{res.exam_title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Score: {res.score} / 10 • Correct: {res.correct_answers}
                    </div>
                  </div>
                  <span className={`badge font-semibold`} style={{
                    backgroundColor: res.percentage >= 50 ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                    color: res.percentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)',
                    fontSize: '0.75rem'
                  }}>
                    {parseFloat(res.percentage).toFixed(2)}%
                  </span>
                </div>
              ))}
              <Link to="/student/results" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
                View Full Score History →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
