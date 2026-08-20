import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogIn, UserPlus, CheckCircle, GraduationCap, Users } from 'lucide-react';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  // If user is already logged in, redirect them to their respective dashboard
  if (currentUser) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="flex align-center gap-2">
          <BookOpen style={{ color: 'var(--color-primary)', width: '28px', height: '28px' }} />
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            College MCQ Portal
          </span>
        </div>
        <div className="flex align-center gap-2">
          <Link to="/login" className="btn btn-outline" style={{ borderRadius: '6px' }}>
            <LogIn size={16} />
            <span>Sign In</span>
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ borderRadius: '6px' }}>
            <UserPlus size={16} />
            <span>Register</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          letterSpacing: '-0.025em'
        }}>
          Manage & Attempt MCQ Exams <br />
          <span style={{ color: 'var(--color-primary)' }}>Anytime, Anywhere.</span>
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          A clean, professional evaluation platform designed for academic colleges. Includes robust role access control, question editing, precise timers, and automated grading statistics.
        </p>

        <div className="flex gap-3 justify-center flex-mobile-col" style={{ width: '100%', marginBottom: '4rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderRadius: '8px' }}>
            <span>Sign In to Dashboard</span>
          </Link>
          <Link to="/register" className="btn btn-outline" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderRadius: '8px' }}>
            <span>Create Account</span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-3" style={{ width: '100%' }}>
          <div className="card text-center" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Automated Grading</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Results are calculated instantly by the server post-submission and stored directly in the database.
            </p>
          </div>

          <div className="card text-center" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <GraduationCap size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Interactive Test Taking</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Responsive interface with precise timers, jump grids, instructions panels, and auto-submit features.
            </p>
          </div>

          <div className="card text-center" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-warning-light)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Role Authorization</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Distinct layouts and features configured for System Administrators, Course Examiners, and Students.
            </p>
          </div>
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        College Academic Project - Online MCQ Exam System © 2026. Built with React & Node.js.
      </footer>
    </div>
  );
};

export default Home;
