// src/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [newIssues, setNewIssues] = useState([]);
  const [pendingIssues, setPendingIssues] = useState([]);
  const [solvedIssues, setSolvedIssues] = useState([]);

  useEffect(() => {
    // Call API to fetch issues
    // For now, just mock the data
    setNewIssues([
      { id: 1, title: 'Issue 1', description: 'Description 1' },
      { id: 2, title: 'Issue 2', description: 'Description 2' },
    ]);

    setPendingIssues([
      { id: 3, title: 'Issue 3', description: 'Description 3' },
      { id: 4, title: 'Issue 4', description: 'Description 4' },
    ]);

    setSolvedIssues([
      { id: 5, title: 'Issue 5', description: 'Description 5' },
      { id: 6, title: 'Issue 6', description: 'Description 6' },
    ]);
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <h2>New Issues</h2>
      <ul>
        {newIssues.map((issue) => (
          <li key={issue.id}>{issue.title}</li>
        ))}
      </ul>

      <h2>Pending Issues</h2>
      <ul>
        {pendingIssues.map((issue) => (
          <li key={issue.id}>{issue.title}</li>
        ))}
      </ul>

      <h2>Solved Issues</h2>
      <ul>
        {solvedIssues.map((issue) => (
          <li key={issue.id}>{issue.title}</li>
        ))}
        </ul>
      </div>
    );
  };
  
  export default StudentDashboard;
  