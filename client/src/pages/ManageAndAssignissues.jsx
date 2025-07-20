import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../auth';
import NotificationBadge from '../components/NotificationBadge';

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all issues
        const issuesResponse = await api.get('/issues/');
        setIssues(issuesResponse.data);
        
        // Fetch faculty members for assignment
        const facultyResponse = await api.get('/auth/faculty-members/');
        setFacultyMembers(facultyResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAssignIssue = async (issueId, facultyId) => {
    try {
      const response = await api.patch(`/issues/${issueId}/`, {
        assigned_to: facultyId,
        status: 'assigned'
      });
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, assigned_to: facultyId, status: 'assigned' } : issue
      ));
      
      alert('Issue assigned successfully!');
    } catch (err) {
      console.error('Error assigning issue:', err);
      alert('Failed to assign issue. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading issues...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-issues-container">
      <div className="manage-issues-header">
        <h2>Manage and Assign Issues</h2>
        <div className="notification-wrapper">
          <NotificationBadge />
        </div>
      </div>
      
      {issues.length === 0 ? (
        <div className="no-issues">
          <p>No issues to manage at the moment.</p>
        </div>
      ) : (
        <div className="issues-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} className={issue.status}>
                  <td>{issue.id}</td>
                  <td>{issue.title}</td>
                  <td>{issue.category}</td>
                  <td>
                    <span className={`priority ${issue.priority}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td>{issue.status}</td>
                  <td>{issue.created_by_username}</td>
                  <td>{new Date(issue.created_at).toLocaleString()}</td>
                  <td>{issue.assigned_to_username || 'Unassigned'}</td>
                  <td>
                    {issue.status !== 'resolved' && issue.status !== 'closed' && (
                      <div className="issue-actions">
                        <select 
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignIssue(issue.id, e.target.value);
                            }
                          }}
                        >
                          <option value="" disabled>Assign to...</option>
                          {facultyMembers.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                              {faculty.first_name} {faculty.last_name}
                            </option>
                          ))}
                        </select>
                        
                        <button 
                          className="view-details-button"
                          onClick={() => window.location.href = `/issues/${issue.id}`}
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageIssues;