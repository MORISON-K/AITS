import React from 'react';
import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from './auth';
import api from './api';
import NotificationBadge from './components/NotificationBadge';

const getStatusClass = (status) =>
  status === "resolved" ? "resolved" : "assigned";
// Sidebar Components
const Sidebar = ({ handleLogout, user }) => {
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
        <Link to="/AssignedIssues">
        <i className="bx bxs-folder-open text-xl mr-3"></i>
            <span className="text">View And Resolve Issues</span>
          </Link>
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

// Recent History Table Component


const RecentHistoryTable = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get("/issues/assigned/")
      .then((res) => {
        // Assuming res.data is an array of issues, some with status 'assigned' and some 'resolved'
        setHistory(res.data);
      })
      .catch((err) => {
        console.error("Error loading history:", err);
        setHistory([]);
      });
  }, []);

  return (
    <div className="order">
      <div className="head">
        <h3>Issue History</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Course Unit</th>
            <th>Student Role ID</th>
            <th>Category</th>
            <th>Date Created</th>
            {/* <th>Date Resolved</th> */}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.id}>
              <td>{row.course_details?.name || "N/A"}</td>
              <td>{row.student?.role_id || "N/A"}</td>
              <td>{row.category}</td>
              <td>
                {row.created_at
                  ? new Date(row.created_at).toLocaleDateString()
                  : "—"}
              </td>
              {/* <td>
                {row.resolved_at
                  ? new Date(row.resolved_at).toLocaleDateString()
                  : "—"}
              </td> */}
              <td>
                <span className={`status ${getStatusClass(row.status)}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
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
      <nav>
        <div className="nav-right">
          <NotificationBadge />
        </div>
      </nav>
      <main>
        <div className="head-title">
          <div className="left">
            <h1>Welcome Lecturer!</h1>
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

// Main LecturerDashboard Component
const LecturerDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/Login-Page');
  };

  return (
    <div className="admin-hub">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Content />
    </div>
  );
};

export default LecturerDashboard;
