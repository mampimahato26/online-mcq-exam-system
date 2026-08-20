import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader, AlertCircle, BookOpen, Clock, Calendar, User } from 'lucide-react';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.admin.getExams();
        setExams(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch exams list.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Exams</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Audit all exams active in the system.</p>
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
              No exams have been created yet.
            </div>
          ) : (
            <div className="grid grid-2">
              {exams.map((exam) => (
                <div key={exam.id} className="card flex flex-column" style={{ gap: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="flex align-center justify-between">
                    <span className="badge badge-student" style={{ fontSize: '0.7rem' }}>EXAM ID: #{exam.id}</span>
                    <div className="flex align-center gap-1 text-muted" style={{ fontSize: '0.8125rem' }}>
                      <Calendar size={14} />
                      <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{exam.title}</h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div className="flex align-center gap-1">
                      <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                      <span><strong>Duration:</strong> {exam.duration} mins</span>
                    </div>
                    <div className="flex align-center gap-1">
                      <User size={16} style={{ color: 'var(--color-warning)' }} />
                      <span><strong>Examiner:</strong> {exam.examiner_name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageExams;
