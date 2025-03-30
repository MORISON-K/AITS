import React from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';
import IssueSubmission_form from './IssueSubmission_form';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import RegistrarDashboard from './RegistrarDashboard';
import LecturerDashboard from './LecturerDashboard';
import ManageIssues from "./pages/ManageAndAssignissues";
import NotFound from './pages/NotFound';
import 'boxicons/css/boxicons.min.css';
import { AuthProvider, AuthContext } from './auth';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <nav className="nav-bar">
            <button className="nav-button" onClick={() => window.location.href = '/'}> Home </button>
          </nav>
          <Routes>
            {/* Main entry point with welcome page */}
            <Route path="/" element={
              <AuthContext.Consumer>
                {({ currentPage, handlePageChange, user }) => {
                  if (user) {
                    // Redirect logged-in users to appropriate dashboard
                    return <Navigate to={
                      user.role === 'academic registrar' ? '/registrar-dashboard' :
                      user.role === 'lecturer' ? '/lecturer-dashboard' : '/student-dashboard'
                    } />;
                  }

                  // Show welcome/login/register based on currentPage
                  return currentPage === 'welcome' ? (
                    <div className="welcome-page">
                      <img src="/muk_logo.jpeg" alt="Logo" />
                      <h1>Welcome to Academic Issue Tracking System</h1>
                      <div className="button-container">
                        <button className="register-button" onClick={() => handlePageChange('register')}>
                          Register
                        </button>
                        <button className="login-button" onClick={() => handlePageChange('login')}>
                          Login
                        </button>
                      </div>
                    </div>
                  ) : currentPage === 'login' ? (
                    <Login handlePageChange={handlePageChange} />
                  ) : currentPage === 'register' ? (
                    <Register handlePageChange={handlePageChange} />
                  ) : null;
                }}
              </AuthContext.Consumer>
            } />

            {/* Public routes */}
            <Route path="/IssueSubmission-Page" element={<IssueSubmission_form />} />

            {/* Protected routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/registrar-dashboard" element={
              <ProtectedRoute allowedRoles={['academic registrar']}>
                <RegistrarDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/lecturer-dashboard" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <LecturerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/manage-issues" element={
              <ProtectedRoute allowedRoles={['academic registrar']}>
                <ManageIssues />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;