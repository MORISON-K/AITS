import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import api from './api';
import { useState, useEffect } from 'react';

// Sidebar Component
const Sidebar = ( { handleLogout } ) => {
  return (
    <section id="sidebar">
      <Link to="/profile" className="brand">
        <i className="bx bxs-smile"></i>
        <span className="text">Profile</span>
      </Link>
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
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/Login-Page');
  };
  return (
    <div className="admin-hub">
      <Sidebar handleLogout={handleLogout} />
      <Content />
    </div>
  );
};

export default StudentDashboard;
