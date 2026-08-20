import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Clock, User, Calendar, Loader, AlertCircle } from 'lucide-react';

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, attemptsRes] = await Promise.all([
          api.student.getAvailableExams(),
          api.student.getMyResults()
        ]);
        setExams(examsRes.data);
        setAttempts(attemptsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load available exams.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper check
  const isExamAttempted = (examId) => {
    return attempts.some(a => a.exam_id === examId);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Available MCQ Exams</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Attempt your college examination tests below. Remember, exams can only be taken once.</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center align-center" style={{ minHeight: '40vh' }}>
          <Loader size={36} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <div>
          {exams.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
              No examinations are currently active in this semester.
            </div>
          ) : (
            <div className="grid grid-3">
              {exams.map((exam) => {
                const attempted = isExamAttempted(exam.id);
                return (
                  <div key={exam.id} className="card flex flex-column justify-between" style={{
                    gap: '1.25rem',
                    borderTop: attempted ? '4px solid var(--color-success)' : '4px solid var(--color-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {exam.title}
                      </h3>
                      
                      <div className="flex flex-column gap-1 text-muted" style={{ fontSize: '0.8125rem' }}>
                        <div className="flex align-center gap-1">
                          <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                          <span><strong>Duration:</strong> {exam.duration} Minutes</span>
                        </div>
                        <div className="flex align-center gap-1">
                          <User size={14} style={{ color: 'var(--color-warning)' }} />
                          <span><strong>Examiner:</strong> {exam.examiner_name}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.75rem',
                      marginTop: '0.5rem'
                    }}>
                      {attempted ? (
                        <>
                          <span className="badge" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', fontWeight: 600 }}>
                            Attempted
                          </span>
                          <Link to="/student/results" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            View Grade
                          </Link>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>10 Questions</span>
                          <Link to={`/student/exams/${exam.id}/instructions`} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}>
                            Start Exam
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableExams;
