import React, { useState, useEffect } from 'react';

const ManageIssues = () => {
  const [issues, setIssues] = useState([]); // List of student-submitted issues
  const [filterStatus, setFilterStatus] = useState('All'); // Filter by status

  // Simulated API fetch (replace with actual API call)
  useEffect(() => {
    setIssues([
      { id: 1, title: 'Login issue', status: 'Pending', student: 'John Doe' },
      { id: 2, title: 'Error in grading', status: 'Assigned', student: 'Alice Smith' },
      { id: 3, title: 'Course registration failure', status: 'Resolved', student: 'Michael Brown' },
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
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Student</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.id}</td>
              <td>{issue.title}</td>
              <td>{issue.student}</td>
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
