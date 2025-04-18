import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "boxicons/css/boxicons.min.css";  // Import Boxicons for the icons
import { useAuth } from './auth';
import { useEffect, useState } from 'react';
import api from './api';


// Sidebar Component
const Sidebar = ( { handleLogout } ) => {
  return (
    <section id="sidebar" className="bg-gray-800 text-white w-64 min-h-screen">
      <Link to="/profile" className="brand flex items-center p-4 text-xl">
        <i className="bx bxs-user text-2xl"></i>
        <span className="ml-3 text-white">Registrar Profile</span>
      </Link>
      <ul className="side-menu top p-4">
        <li className="active">
          <Link to="/registrar-dashboard" className="flex items-center p-3 text-white hover:bg-gray-700">
            <i className="bx bxs-dashboard text-xl mr-3"></i>
            <span className="text-lg">Dashboard</span>
          </Link>
          
        </li>
        <li className="active" >
          <Link to="/manage-issues" className="flex items-center p-3 text-white hover:bg-gray-700">
            <i className="bx bxs-folder-open text-xl mr-3"></i>
            <span className="text-lg">Manage Student Issues.</span>
          </Link>
        </li>
        
      
        
      </ul>
      <ul className="side-menu p-4">
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

// Recent History
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
            <th>Student ID</th>
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
              <td>{issue.roleId}</td>
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
    <section id="content" className="bg-gray-50 p-6 rounded-lg flex-1">
      <main>
        {/* Header Section */}
        <div className="head-title flex justify-between items-center mb-6">
          <div className="left">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Registrar!</h1>
            <ul className="breadcrumb text-sm text-gray-600">
              <li>
                <Link to="/registrar-dashboard">Dashboard</Link>
              </li>
              <li>
                <i className="bx bx-chevron-right text-gray-500"></i>
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


// Main RegistrarDashboard Component
const RegistrarDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/Login-Page');
  };
  return (
    <div className="admin-hub flex">
      <Sidebar handleLogout={handleLogout} />
      <Content />
    </div>
  );
};

export default RegistrarDashboard;
