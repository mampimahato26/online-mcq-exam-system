import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader, AlertCircle, Calendar, Award, ChevronLeft } from 'lucide-react';

const ExamResults = () => {
  const { id } = useParams(); // Exam ID
  const [examTitle, setExamTitle] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.examiner.getExamResults(id);
        setExamTitle(response.data.examTitle);
        setResults(response.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch exam results. Check if this is your exam.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/examiner/exams" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', marginBottom: '1rem', borderRadius: '6px' }}>
          <ChevronLeft size={16} />
          <span>Back to Exams</span>
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Exam Student Results</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Exam: <strong>{examTitle}</strong></p>
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
              No students have taken this exam yet.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Score</th>
                  <th>Correct / Wrong</th>
                  <th>Percentage</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.student_name}</td>
                    <td>{r.student_email}</td>
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

export default ExamResults;
