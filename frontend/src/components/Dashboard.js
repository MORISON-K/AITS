import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';

const Dashboard = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      default:
        return (
          <div className="role-error-container">
            <div className="alert alert-warning">
              <h4>Role Not Found</h4>
              <p>Your user account doesn't have a valid role assigned. Please contact an administrator.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h2>Welcome, {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'User'}</h2>
        <p className="role-badge">
          {userRole === 'student' && <span className="badge badge-info">Student</span>}
          {userRole === 'faculty' && <span className="badge badge-success">Faculty</span>}
          {userRole === 'admin' && <span className="badge badge-primary">Administrator</span>}
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
