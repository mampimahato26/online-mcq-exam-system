import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader, AlertCircle, Calendar, BookOpen, Award } from 'lucide-react';

const AllResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.admin.getResults();
        setResults(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch system results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student Results Audit</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review all student submissions and score details.</p>
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
        <div className="table-container">
          {results.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No exam results recorded in the database yet.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam Title</th>
                  <th>Score</th>
                  <th>Correct / Wrong</th>
                  <th>Percentage</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-semibold">{r.student_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.student_email}</div>
                    </td>
                    <td className="font-semibold" style={{ color: 'var(--color-primary-hover)' }}>
                      <div className="flex align-center gap-1">
                        <BookOpen size={14} />
                        <span>{r.exam_title}</span>
                      </div>
                    </td>
                    <td className="font-semibold" style={{ fontSize: '1rem' }}>{r.score} / 10</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-success font-semibold">{r.correct_answers} Correct</span>
                      {' / '}
                      <span className="text-danger font-semibold">{r.wrong_answers} Wrong</span>
                    </td>
                    <td>
                      <div className="flex align-center gap-1">
                        <Award size={16} className={r.percentage >= 50 ? 'text-success' : 'text-danger'} />
                        <span className={`font-semibold ${r.percentage >= 50 ? 'text-success' : 'text-danger'}`}>
                          {parseFloat(r.percentage).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <div className="flex align-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(r.submitted_at).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AllResults;
