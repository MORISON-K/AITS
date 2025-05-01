import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './auth';

const AssignedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        // Fetch issues assigned to the current user
        // Use the 'assigned' endpoint that we fixed in the backend
        const response = await api.get('/issues/assigned/');
        setIssues(response.data);
      } catch (err) {
        console.error('Error fetching assigned issues:', err);
        setError('Failed to load assigned issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAssignedIssues();
    }
  }, [user]);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await api.patch(`/issues/${issueId}/`, {
        status: newStatus
      });
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (err) {
      console.error('Error updating issue status:', err);
      alert('Failed to update issue status. Please try again.');
    }
  };

  const handleResolveIssue = async (issueId) => {
    try {
      await api.post(`/issues/${issueId}/resolve/`);
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, status: 'resolved' } : issue
      ));
    } catch (err) {
      console.error('Error resolving issue:', err);
      alert('Failed to resolve issue. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading assigned issues...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assigned-issues-container">
      <h2>Issues Assigned to You</h2>
      
      {issues.length === 0 ? (
        <div className="no-issues">
          <p>You don't have any issues assigned to you at the moment.</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map(issue => (
            <div key={issue.id} className={`issue-card ${issue.status}`}>
              <div className="issue-header">
                <h3>{issue.title}</h3>
                <span className={`priority ${issue.priority}`}>
                  {issue.priority}
                </span>
              </div>
              
              <div className="issue-details">
                <p><strong>Category:</strong> {issue.category}</p>
                <p><strong>Reported by:</strong> {issue.created_by_username}</p>
                <p><strong>Status:</strong> {issue.status}</p>
                <p><strong>Created:</strong> {new Date(issue.created_at).toLocaleString()}</p>
              </div>
              
              <div className="issue-description">
                <p>{issue.description}</p>
              </div>
              
              {issue.comments && issue.comments.length > 0 && (
                <div className="issue-comments">
                  <h4>Comments</h4>
                  {issue.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <p className="comment-author">{comment.user_username}</p>
                      <p className="comment-content">{comment.content}</p>
                      <p className="comment-date">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="issue-actions">
                {issue.status !== 'resolved' && (
                  <>
                    <select 
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                    
                    <button 
                      className="resolve-button"
                      onClick={() => handleResolveIssue(issue.id)}
                    >
                      Mark as Resolved
                    </button>
                  </>
                )}
                
                <button 
                  className="view-details-button"
                  onClick={() => window.location.href = `/issues/${issue.id}`}
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;