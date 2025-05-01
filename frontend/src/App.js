import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import Notifications from './components/Notifications';

// Context
import { AuthContext } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/issues/new" element={
              <ProtectedRoute>
                <IssueForm />
              </ProtectedRoute>
            } />
            <Route path="/issues/:id" element={
              <ProtectedRoute>
                <IssueDetail />
              </ProtectedRoute>
            } />
            <Route path="/issues/:id/edit" element={
              <ProtectedRoute>
                <IssueForm isEditing={true} />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={
              isAuthenticated 
                ? <Navigate to="/dashboard" /> 
                : <Navigate to="/login" />
            } />
            
            {/* 404 - Redirect to dashboard or login */}
            <Route path="*" element={
              isAuthenticated 
                ? <Navigate to="/dashboard" /> 
                : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
