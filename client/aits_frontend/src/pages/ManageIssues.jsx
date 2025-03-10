import React, { useState, useEffect } from 'react';

const ManageIssues = () => {
  const [issues, setIssues] = useState([]); // List of student-submitted issues
  const [filterStatus, setFilterStatus] = useState('All'); // Filter by status

  // Simulated API fetch (replace with actual API call)
  useEffect(() => {
    setIssues([
      { id: 1, issue: 'Login issue', status: 'Pending', studentNumber: 'S12345' }, // student number instead of name
      { id: 2, issue: 'Error in grading', status: 'Assigned', studentNumber: 'S67890' },
      { id: 3, issue: 'Course registration failure', status: 'Resolved', studentNumber: 'S11223' },
    ]);
  }, []);

  // Function to update issue status
  const updateStatus = (id, newStatus) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  // Filtered issues based on status
  const filteredIssues = filterStatus === 'All' ? issues : issues.filter(issue => issue.status === filterStatus);

  return (
    <div>
      <h2>Manage Student Issues</h2>

      {/* Filter Dropdown */}
      <label>
        Filter by Status:
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
      </label>

      {/* Issues Table */}
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>issue</th>
            <th>Student Number</th> {/* Displaying student number */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.id}</td>
              <td>{issue.issue}</td>
              <td>{issue.studentNumber}</td> {/* Displaying student number */}
              <td>{issue.status}</td>
              <td>
                {issue.status !== 'Resolved' && (
                  <>
                    {issue.status === 'Pending' && (
                      <button onClick={() => updateStatus(issue.id, 'Assigned')}>Assign</button>
                    )}
                    <button onClick={() => updateStatus(issue.id, 'Resolved')}>Resolve</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageIssues;
