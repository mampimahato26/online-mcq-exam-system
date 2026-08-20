import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader, AlertCircle, Calendar, Award, BookOpen } from 'lucide-react';

const ResultHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.student.getMyResults();
        setResults(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your result history.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Result History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review all your previous MCQ exam attempts and scores.</p>
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
              You have not attempted any exams yet. Go to "Available Exams" to start!
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th>Correct / Wrong</th>
                  <th>Percentage</th>
                  <th>Attempt Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold" style={{ color: 'var(--color-primary-hover)' }}>
                      <div className="flex align-center gap-1">
                        <BookOpen size={14} />
                        <span>{r.exam_title}</span>
                      </div>
                    </td>
                    <td>{r.duration} minutes</td>
                    <td className="font-semibold" style={{ fontSize: '1rem' }}>{r.score} / 10</td>
                    <td>
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

export default ResultHistory;
