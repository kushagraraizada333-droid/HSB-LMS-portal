import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentGrades } from './pages/student/StudentGrades';
import { StudentAnnouncements } from './pages/student/StudentAnnouncements';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyCourses } from './pages/faculty/FacultyCourses';
import { FacultyGrading } from './pages/faculty/FacultyGrading';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyMaterials } from './pages/faculty/FacultyMaterials';
import { FacultyAnnouncements } from './pages/faculty/FacultyAnnouncements';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';

// Profile Page
import { ProfilePage } from './pages/profile/ProfilePage';

// Role-based Root Redirect component
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'faculty') return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Application Shell */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<RootRedirect />} />

              {/* Student Routes */}
              <Route path="student" element={<StudentDashboard />} />
              <Route path="student/courses" element={<StudentCourses />} />
              <Route path="student/assignments" element={<StudentAssignments />} />
              <Route path="student/attendance" element={<StudentAttendance />} />
              <Route path="student/grades" element={<StudentGrades />} />
              <Route path="student/announcements" element={<StudentAnnouncements />} />

              {/* Faculty Routes */}
              <Route path="faculty" element={<FacultyDashboard />} />
              <Route path="faculty/courses" element={<FacultyCourses />} />
              <Route path="faculty/grading" element={<FacultyGrading />} />
              <Route path="faculty/attendance" element={<FacultyAttendance />} />
              <Route path="faculty/materials" element={<FacultyMaterials />} />
              <Route path="faculty/announcements" element={<FacultyAnnouncements />} />

              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/students" element={<AdminStudents />} />
              <Route path="admin/faculty" element={<AdminFaculty />} />
              <Route path="admin/courses" element={<AdminCourses />} />
              <Route path="admin/announcements" element={<AdminAnnouncements />} />

              {/* Shared Profile Route */}
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
