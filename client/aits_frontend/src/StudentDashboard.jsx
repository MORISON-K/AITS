import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import api from './api';
import { useState, useEffect } from 'react';

// Sidebar Component
const Sidebar = ({ handleLogout, user }) => {
  // Debug: Log the user object to see its structure
  console.log("Sidebar user object:", user);
  
  return (
    <section id="sidebar">
  <div className="brand">
    <i className="bx bxs-smile"></i>

    <span className="text">
      {user ? (
        <div className="user-info">
          <div className="user-name">
            <strong>Name:</strong> {user.name || user.username || user.fullName || user.full_name || user.email || 'Unknown'}
          </div>
          {(user.role_id || user.roleId) && (
            <div className="role-id">
              <strong>Role:</strong> {user.role_id || user.roleId}
            </div>
          )}
        </div>
      ) : (
        'Profile'
      )}
    </span>
  </div>


      
      <ul className="side-menu top">
        <li className="active">
          <Link to="/dashboard">
            <i className="bx bxs-dashboard"></i>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/IssueSubmission-Page">
            <i className="bx bxs-shopping-bag-alt"></i>
            <span className="text">Create A New Issue</span>
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <i className="bx bxs-bell"></i>
            <span className="text">Notifications</span>
          </Link>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <a href="#!" onClick={handleLogout} className="logout">
            <i className="bx bxs-log-out-circle"></i>
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
};

// Recent history table
const RecentHistoryTable = () => {
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    const fetchStudentIssues = async () => {
      try {
        const response = await api.get('/api/my-issues/');
        setIssues(response.data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };
    fetchStudentIssues();
  }, []);

  return (
    <div className="order">
      <div className="head">
        <h3>Recent History</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Course Unit</th>
            <th>Issue Category</th>
            <th>Date Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr key={index}>
              <td>
              <p>{issue.course_details?.name || "N/A"}</p>
              </td>
              <td>{issue.category}</td>
              <td>{new Date(issue.created_at).toLocaleDateString()}</td>
              <td>
                <span className={`status ${issue.status.toLowerCase()}`}>
                  {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Content Component
const Content = () => {
  return (
    <section id="content">
      <main>
        <div className="head-title">
          <div className="left">
            <h1>Welcome Student!</h1>
            <ul className="breadcrumb">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <i className="bx bx-chevron-right"></i>
              </li>
            </ul>
          </div>
        </div>
        <div className="table-data">
          <RecentHistoryTable />
        </div>
      </main>
    </section>
  );
};

// Main StudentDashboard Component
const StudentDashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Debug: Log the entire auth object to see what it contains
  console.log("Auth object:", auth);
  
  // Extract user from auth context
  const user = auth.user;
  
  // Debug: Log the user object
  console.log("Main component user object:", user);
  
  const handleLogout = (e) => {
    e.preventDefault();
    auth.logout();
    navigate('/Login-Page');
  };

  // Fetch user data if not available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
          // This is a placeholder - you might need to adjust this based on your API
          const response = await api.get('/api/user/profile');
          console.log("Fetched user data:", response.data);
          // You might need to update the auth context with this data
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  return (
    <div className="admin-hub">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Content />
    </div>
  );
};

export default StudentDashboard;
