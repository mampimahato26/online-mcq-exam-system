import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, GraduationCap, BookOpen, FileSpreadsheet, Loader, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    examinersCount: 0,
    examsCount: 0,
    resultsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.admin.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>System statistics and overview.</p>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        {/* Total Students */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Students</div>
            <div className="stat-number">{stats.studentsCount}</div>
          </div>
        </div>

        {/* Total Examiners */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Examiners</div>
            <div className="stat-number">{stats.examinersCount}</div>
          </div>
        </div>

        {/* Total Exams */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Exams</div>
            <div className="stat-number">{stats.examsCount}</div>
          </div>
        </div>

        {/* Total Results */}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Submissions</div>
            <div className="stat-number">{stats.resultsCount}</div>
          </div>
        </div>
      </div>

      {/* Quick Info & Welcome */}
      <div className="grid grid-2">
        <div className="card">
          <h2 className="card-title">Welcome Admin!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            As a System Administrator, you have full control over the college's examination parameters. You can perform the following operational tasks:
          </p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
            <li>Manage student enrollment records and delete accounts if required.</li>
            <li>Manage examiner profiles and create new academic login credentials.</li>
            <li>Audit all created exams and examine their questions.</li>
            <li>Review all student test submissions and score percentages in real time.</li>
          </ul>
        </div>

        <div className="card flex flex-column justify-center" style={{ gap: '0.75rem', minHeight: '200px' }}>
          <div className="flex align-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Current Academic Session</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Semester Fall 2026
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            Online testing environment status: <span className="text-success font-semibold">Active & Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
