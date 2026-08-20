import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
  const { login, currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, navigate away
  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}/dashboard`, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      console.error('Login submit error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper flex-column justify-center align-center">
      <div className="flex align-center gap-2" style={{ marginBottom: '2rem' }}>
        <BookOpen style={{ color: 'var(--color-primary)', width: '32px', height: '32px' }} />
        <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          College MCQ Portal
        </span>
      </div>

      <div className="auth-card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Sign In
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Enter your academic credentials to proceed.
        </p>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span className="text-muted">Need an account? </span>
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>

      {/* Helper credentials box */}
      <div style={{
        marginTop: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.8125rem'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Sample Login Credentials:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', color: 'var(--text-secondary)' }}>
          <strong>Admin:</strong> <span>admin@exam.com / admin123</span>
          <strong>Examiner:</strong> <span>examiner@exam.com / examiner123</span>
          <strong>Student:</strong> <span>student@exam.com / student123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
