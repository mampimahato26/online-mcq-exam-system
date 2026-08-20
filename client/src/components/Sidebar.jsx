import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  FilePlus,
  BookOpen,
  History,
  FileSpreadsheet
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return null;

  const role = currentUser.role;

  // Custom navigation items based on role
  const menuItems = {
    admin: [
      { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/admin/students', name: 'Manage Students', icon: <GraduationCap size={18} /> },
      { path: '/admin/examiners', name: 'Manage Examiners', icon: <Users size={18} /> },
      { path: '/admin/exams', name: 'Manage Exams', icon: <BookOpen size={18} /> },
      { path: '/admin/results', name: 'View All Results', icon: <FileSpreadsheet size={18} /> }
    ],
    examiner: [
      { path: '/examiner/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/examiner/create-exam', name: 'Create Exam', icon: <FilePlus size={18} /> },
      { path: '/examiner/exams', name: 'My Exams', icon: <BookOpen size={18} /> }
    ],
    student: [
      { path: '/student/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/student/exams', name: 'Available Exams', icon: <ClipboardList size={18} /> },
      { path: '/student/results', name: 'Result History', icon: <History size={18} /> }
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'var(--text-white)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        padding: '1.5rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation Portal
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
          Academic Board
        </div>
      </div>
      
      <nav style={{
        flex: 1,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem'
      }}>
        {currentMenu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: isActive ? 'var(--text-white)' : 'rgba(255, 255, 255, 0.65)',
              backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'var(--transition)'
            })}
            className="sidebar-link"
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.3)'
      }}>
        © 2026 Academic Panel
      </div>
    </aside>
  );
};

export default Sidebar;
