import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageExaminers from './pages/Admin/ManageExaminers';
import ManageExams from './pages/Admin/ManageExams';
import AllResults from './pages/Admin/AllResults';

// Examiner Pages
import ExaminerDashboard from './pages/Examiner/Dashboard';
import CreateExam from './pages/Examiner/CreateExam';
import AddQuestions from './pages/Examiner/AddQuestions';
import MyExams from './pages/Examiner/MyExams';
import ExamResults from './pages/Examiner/ExamResults';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import AvailableExams from './pages/Student/AvailableExams';
import ExamInstructions from './pages/Student/ExamInstructions';
import TakeExam from './pages/Student/TakeExam';
import ResultPage from './pages/Student/ResultPage';
import ResultHistory from './pages/Student/ResultHistory';

import { Loader } from 'lucide-react';

// Route Guard to verify user is authenticated
const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '100vh' }}>
        <Loader size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Route Guard to verify user has the correct role
const RoleRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ minHeight: '100vh' }}>
        <Loader size={40} className="animate-spin" />
      </div>
    );
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    // If unauthorized, send to root which redirects correctly
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Wrapper for authenticated dashboard views
const DashboardLayout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          <Routes>
            {/* Admin Routes */}
            <Route path="admin/dashboard" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
            <Route path="admin/students" element={<RoleRoute allowedRoles={['admin']}><ManageStudents /></RoleRoute>} />
            <Route path="admin/examiners" element={<RoleRoute allowedRoles={['admin']}><ManageExaminers /></RoleRoute>} />
            <Route path="admin/exams" element={<RoleRoute allowedRoles={['admin']}><ManageExams /></RoleRoute>} />
            <Route path="admin/results" element={<RoleRoute allowedRoles={['admin']}><AllResults /></RoleRoute>} />

            {/* Examiner Routes */}
            <Route path="examiner/dashboard" element={<RoleRoute allowedRoles={['examiner']}><ExaminerDashboard /></RoleRoute>} />
            <Route path="examiner/create-exam" element={<RoleRoute allowedRoles={['examiner']}><CreateExam /></RoleRoute>} />
            <Route path="examiner/exams/:id/questions" element={<RoleRoute allowedRoles={['examiner']}><AddQuestions /></RoleRoute>} />
            <Route path="examiner/exams" element={<RoleRoute allowedRoles={['examiner']}><MyExams /></RoleRoute>} />
            <Route path="examiner/exams/:id/results" element={<RoleRoute allowedRoles={['examiner']}><ExamResults /></RoleRoute>} />

            {/* Student Routes */}
            <Route path="student/dashboard" element={<RoleRoute allowedRoles={['student']}><StudentDashboard /></RoleRoute>} />
            <Route path="student/exams" element={<RoleRoute allowedRoles={['student']}><AvailableExams /></RoleRoute>} />
            <Route path="student/exams/:id/instructions" element={<RoleRoute allowedRoles={['student']}><ExamInstructions /></RoleRoute>} />
            <Route path="student/exams/:id/take" element={<RoleRoute allowedRoles={['student']}><TakeExam /></RoleRoute>} />
            <Route path="student/exams/:id/result" element={<RoleRoute allowedRoles={['student']}><ResultPage /></RoleRoute>} />
            <Route path="student/results" element={<RoleRoute allowedRoles={['student']}><ResultHistory /></RoleRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Dashboard Views Wrapper */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
