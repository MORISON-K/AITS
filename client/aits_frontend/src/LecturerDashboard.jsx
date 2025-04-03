
import React from 'react';
import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from './auth';

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
  const [data, setData] = useState([]);
  const [feedbackText, setFeedbackText] = useState({}); // Store feedback for each issue

  useEffect(() => {
    fetch("API_ENDPOINT_FOR_ASSIGNED_ISSUES") // Replace with actual API URL
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const sendFeedback = (issueId) => {
    if (!feedbackText[issueId]) {
      alert("Please enter feedback before submitting.");
      return;
    }

    fetch(`API_ENDPOINT_FOR_SENDING_FEEDBACK/${issueId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Resolved",
        feedback: feedbackText[issueId], // Send custom feedback
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        alert("Feedback sent successfully!");
        // Update the issue status locally
        setData(data.map(issue =>
          issue.id === issueId ? { ...issue, status: "Resolved", statusText: "Resolved" } : issue
        ));
        // Clear the feedback field for that issue
        setFeedbackText((prev) => ({ ...prev, [issueId]: "" }));
      })
      .catch((error) => console.error("Error sending feedback:", error));
  };

  return (
    <div className="order">
      <div className="head">
        <h3>Assigned Issues</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Course Unit</th>
            <th>Student Number</th>
            <th>Issue Category</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.course}</td>
              <td>{row.studentNumber}</td>
              <td>{row.category}</td>
              <td>{row.date}</td>
              <td>
                <span className={`status ${row.status}`}>{row.statusText}</span>
              </td>
              <td>
                {row.status !== "Resolved" && (
                  <textarea
                    value={feedbackText[row.id] || ""}
                    onChange={(e) => setFeedbackText({ ...feedbackText, [row.id]: e.target.value })}
                    placeholder="Enter feedback..."
                    rows="2"
                    cols="25"
                  />
                )}
              </td>
              <td>
                {row.status !== "Resolved" && (
                  <button className="resolve-btn" onClick={() => sendFeedback(row.id)}>
                    Mark as Resolved
                  </button>
                )}
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

export default LecturerDashboard;
