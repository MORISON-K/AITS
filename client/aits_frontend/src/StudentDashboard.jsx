import React from 'react';
import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link } from 'react-router-dom';

// Sidebar Component
const Sidebar = () => {
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
            <span className="text">Create a New Issue</span>
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
          <Link to="/logout" className="logout">
            <i className="bx bxs-log-out-circle"></i>
            <span className="text">Logout</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

// Recent History Table Component
const RecentHistoryTable = () => {
  // Data to be fetched from the  API.
  const data = [
    { course: "CSC 1101", category: "Missing Marks", date: "01-10-2021", status: "completed", statusText: "Resolved" },
    { course: "CSC 1101", category: "Missing Marks", date: "01-10-2021", status: "pending", statusText: "Pending" },
    { course: "CSC 1100", category: "Wrong Credentials", date: "01-10-2021", status: "process", statusText: "In Progress" },
  ];

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
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <p>{row.course}</p>
              </td>
              <td>{row.category}</td>
              <td>{row.date}</td>
              <td>
                <span className={`status ${row.status}`}>{row.statusText}</span>
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
  return (
    <div className="admin-hub">
      <Sidebar />
      <Content />
    </div>
  );
};

export default StudentDashboard;
