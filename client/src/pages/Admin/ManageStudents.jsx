import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, UserPlus, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.admin.getUsers();
      // Filter only students
      setStudents(response.data.filter(u => u.role === 'student'));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student: "${name}"? This will delete all their results as well.`)) {
      return;
    }

    try {
      await api.admin.deleteUser(id);
      setSuccess(`Student "${name}" deleted successfully.`);
      setStudents(students.filter(s => s.id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete student.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    if (!newStudent.name || !newStudent.email || !newStudent.password) {
      setModalError('All fields are required.');
      setSubmitting(false);
      return;
    }

    try {
      await api.admin.createUser({
        ...newStudent,
        role: 'student'
      });
      setSuccess(`Student "${newStudent.name}" created successfully.`);
      setShowModal(false);
      setNewStudent({ name: '', email: '', password: '' });
      fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Failed to create student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between align-center flex-mobile-col" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Students</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View, add, or delete college students.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} />
          <span>Add New Student</span>
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
          {students.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No students found. Click "Add New Student" to get started.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-semibold" style={{ color: 'var(--text-secondary)' }}>#{student.id}</td>
                    <td className="font-semibold">{student.name}</td>
                    <td>{student.email}</td>
                    <td>{new Date(student.created_at).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className="btn btn-outline text-danger"
                        style={{ padding: '0.35rem 0.6rem', border: '1px solid transparent' }}
                        title="Delete Student"
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

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Student</h2>
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
                <label className="form-label" htmlFor="modal-name">Full Name</label>
                <input
                  id="modal-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g., Jane Doe"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-email">Email Address</label>
                <input
                  id="modal-email"
                  type="email"
                  className="form-control"
                  placeholder="e.g., jane.doe@college.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="modal-password">Password</label>
                <input
                  id="modal-password"
                  type="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
