import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Edit, Eye, Award, FileSpreadsheet, Plus, Loader, AlertCircle } from 'lucide-react';

const MyExams = () => {
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
        setError('Failed to fetch your exams list.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyExams();
  }, []);

  return (
    <div>
      <div className="flex justify-between align-center flex-mobile-col" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Created Exams</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View details, configure questions, or review scores.</p>
        </div>

        <Link to="/examiner/create-exam" className="btn btn-primary">
          <Plus size={16} />
          <span>Create New Exam</span>
        </Link>
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
          {exams.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No exams created yet. Click "Create New Exam" to create one.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Exam Title</th>
                  <th>Duration</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="font-semibold" style={{ color: 'var(--text-secondary)' }}>#{exam.id}</td>
                    <td className="font-semibold">{exam.title}</td>
                    <td>{exam.duration} minutes</td>
                    <td>{exam.question_count} / 10</td>
                    <td>
                      {exam.question_count === 10 ? (
                        <span className="badge badge-student" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-examiner" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                          Draft (Needs 10 Qs)
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex gap-2 justify-end">
                        <Link
                          to={`/examiner/exams/${exam.id}/questions`}
                          className="btn btn-outline"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          title="Manage Questions"
                        >
                          <Edit size={14} />
                          <span>Questions</span>
                        </Link>
                        
                        <Link
                          to={`/examiner/exams/${exam.id}/results`}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          title="View Results"
                          disabled={exam.question_count !== 10}
                        >
                          <Award size={14} />
                          <span>Results</span>
                        </Link>
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

export default MyExams;
