import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, UserPlus, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const ManageExaminers = () => {
  const [examiners, setExaminers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newExaminer, setNewExaminer] = useState({ name: '', email: '', password: '' });
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExaminers = async () => {
    setLoading(true);
    try {
      const response = await api.admin.getUsers();
      // Filter only examiners
      setExaminers(response.data.filter(u => u.role === 'examiner'));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch examiners list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete examiner: "${name}"? This will delete all exams and questions created by this examiner.`)) {
      return;
    }

    try {
      await api.admin.deleteUser(id);
      setSuccess(`Examiner "${name}" deleted successfully.`);
      setExaminers(examiners.filter(e => e.id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete examiner.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    if (!newExaminer.name || !newExaminer.email || !newExaminer.password) {
      setModalError('All fields are required.');
      setSubmitting(false);
      return;
    }

    try {
      await api.admin.createUser({
        ...newExaminer,
        role: 'examiner'
      });
      setSuccess(`Examiner "${newExaminer.name}" created successfully.`);
      setShowModal(false);
      setNewExaminer({ name: '', email: '', password: '' });
      fetchExaminers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Failed to create examiner.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between align-center flex-mobile-col" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Examiners</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View, add, or remove exam creators.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} />
          <span>Add New Examiner</span>
        </button>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-banner alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center align-center" style={{ minHeight: '40vh' }}>
          <Loader size={36} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <div className="table-container">
          {examiners.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No examiners found. Click "Add New Examiner" to get started.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {examiners.map((examiner) => (
                  <tr key={examiner.id}>
                    <td className="font-semibold" style={{ color: 'var(--text-secondary)' }}>#{examiner.id}</td>
                    <td className="font-semibold">{examiner.name}</td>
                    <td>{examiner.email}</td>
                    <td>{new Date(examiner.created_at).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(examiner.id, examiner.name)}
                        className="btn btn-outline text-danger"
                        style={{ padding: '0.35rem 0.6rem', border: '1px solid transparent' }}
                        title="Delete Examiner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Examiner Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Examiner</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="alert-banner alert-error" style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="ex-name">Full Name</label>
                <input
                  id="ex-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g., Professor Miller"
                  value={newExaminer.name}
                  onChange={(e) => setNewExaminer({ ...newExaminer, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ex-email">Email Address</label>
                <input
                  id="ex-email"
                  type="email"
                  className="form-control"
                  placeholder="e.g., miller@college.com"
                  value={newExaminer.email}
                  onChange={(e) => setNewExaminer({ ...newExaminer, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="ex-password">Password</label>
                <input
                  id="ex-password"
                  type="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={newExaminer.password}
                  onChange={(e) => setNewExaminer({ ...newExaminer, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Examiner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExaminers;
