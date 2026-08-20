import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) return null;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="flex align-center gap-2">
        <BookOpen style={{ color: 'var(--color-primary)', width: '24px', height: '24px' }} />
        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          College MCQ Portal
        </span>
      </div>
      
      <div className="flex align-center gap-3">
        <div className="flex align-center gap-2" style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '0.4rem 0.8rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)'
        }}>
          <User size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            {currentUser.name}
          </span>
          <span className={`badge badge-${currentUser.role}`} style={{ textTransform: 'capitalize' }}>
            {currentUser.role}
          </span>
        </div>
        
        <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
          <LogOut size={15} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
