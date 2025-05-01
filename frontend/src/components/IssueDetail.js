import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { issueService, commentService, systemService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { refreshNotifications } = useContext(NotificationContext);
  
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [facultyMembers, setFacultyMembers] = useState([]);
  
  useEffect(() => {
    fetchIssue();
    fetchComments();
    
    // Only fetch faculty members if user is an admin
    if (currentUser && currentUser.role === 'admin') {
      fetchFacultyMembers();
    }
  }, [id, currentUser]);
  
  const fetchIssue = async () => {
    try {
      const response = await issueService.getIssue(id);
      setIssue(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching issue:', error);
      setError('Failed to load issue details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await commentService.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  const fetchFacultyMembers = async () => {
    try {
      const response = await systemService.getFacultyMembers();
      setFacultyMembers(response.data);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    }
  };
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await commentService.createComment({
        issue: id,
        content: newComment
      });
      
      // Clear comment field and refresh comments
      setNewComment('');
      fetchComments();
      refreshNotifications();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const assignIssue = async (facultyId) => {
    try {
      await issueService.updateIssue(id, {
        assigned_to: facultyId,
        status: 'assigned'
      });
      
      // Refresh issue
      fetchIssue();
      refreshNotifications();
    } catch (error) {
      console.error('Error assigning issue:', error);
      alert('Failed to assign issue. Please try again.');
    }
  };
  
  const updateIssueStatus = async (newStatus) => {
    try {
      if (newStatus === 'resolved') {
        await issueService.resolveIssue(id);
      } else {
        await issueService.updateIssue(id, { status: newStatus });
      }
      
      // Refresh issue
      fetchIssue();
      refreshNotifications();
    } catch (error) {
      console.error('Error updating issue status:', error);
      alert('Failed to update issue status. Please try again.');
    }
  };
  
  // Get status badge styling based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'badge-primary';
      case 'assigned':
        return 'badge-info';
      case 'in_progress':
        return 'badge-warning';
      case 'resolved':
        return 'badge-success';
      case 'closed':
        return 'badge-secondary';
      default:
        return 'badge-light';
    }
  };
  
  // Check if user can edit the issue
  const canEditIssue = () => {
    if (!currentUser || !issue) return false;
    
    if (currentUser.role === 'admin') return true;
    
    if (currentUser.role === 'student' && issue.created_by === currentUser.id && issue.status === 'new') {
      return true;
    }
    
    return false;
  };
  
  // Check if user can resolve the issue
  const canResolveIssue = () => {
    if (!currentUser || !issue) return false;
    
    if (currentUser.role === 'admin') return true;
    
    if (currentUser.role === 'faculty' && 
        issue.assigned_to === currentUser.id && 
        ['assigned', 'in_progress'].includes(issue.status)) {
      return true;
    }
    
    return false;
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!issue) {
    return (
      <div className="not-found-container">
        <div className="alert alert-warning" role="alert">
          Issue not found
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="issue-detail-container">
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Issue #{issue.id}: {issue.title}</h3>
          <div>
            <button 
              className="btn btn-outline-secondary btn-sm mr-2"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            
            {canEditIssue() && (
              <Link 
                to={`/issues/${issue.id}/edit`}
                className="btn btn-outline-primary btn-sm"
              >
                Edit Issue
              </Link>
            )}
          </div>
        </div>
        
        <div className="card-body">
          <div className="issue-meta mb-4">
            <div className="row">
              <div className="col-md-6">
                <div className="meta-item">
                  <strong>Reported By:</strong> {issue.created_by_username}
                </div>
                <div className="meta-item">
                  <strong>Category:</strong> {issue.category}
                </div>
                <div className="meta-item">
                  <strong>Priority:</strong> 
                  <span className={`badge ml-2 ${issue.priority === 'high' || issue.priority === 'urgent' ? 'badge-danger' : 'badge-info'}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="meta-item">
                  <strong>Status:</strong> 
                  <span className={`badge ml-2 ${getStatusBadgeClass(issue.status)}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="meta-item">
                  <strong>Created:</strong> {new Date(issue.created_at).toLocaleString()}
                </div>
                <div className="meta-item">
                  <strong>Last Updated:</strong> {new Date(issue.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="row mt-3">
              <div className="col-12">
                <div className="meta-item">
                  <strong>Assigned To:</strong> 
                  {issue.assigned_to ? (
                    <span>{issue.assigned_to_username}</span>
                  ) : (
                    currentUser && currentUser.role === 'admin' ? (
                      <div className="dropdown d-inline-block ml-2">
                        <button 
                          className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          id="assignDropdown" 
                          data-toggle="dropdown" 
                          aria-haspopup="true" 
                          aria-expanded="false"
                        >
                          Assign to Faculty
                        </button>
                        <div className="dropdown-menu" aria-labelledby="assignDropdown">
                          {facultyMembers.map(faculty => (
                            <button 
                              key={faculty.id} 
                              className="dropdown-item"
                              onClick={() => assignIssue(faculty.id)}
                            >
                              {faculty.first_name} {faculty.last_name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )
                  )}
                </div>
              </div>
            </div>
            
            {/* Status update buttons */}
            {(currentUser && (currentUser.role === 'admin' || 
              (currentUser.role === 'faculty' && issue.assigned_to === currentUser.id))) && (
              <div className="status-actions mt-3">
                <div className="btn-group">
                  {issue.status === 'assigned' && (
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => updateIssueStatus('in_progress')}
                    >
                      Start Working
                    </button>
                  )}
                  
                  {['assigned', 'in_progress'].includes(issue.status) && canResolveIssue() && (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => updateIssueStatus('resolved')}
                    >
                      Mark as Resolved
                    </button>
                  )}
                  
                  {issue.status === 'resolved' && currentUser.role === 'admin' && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateIssueStatus('closed')}
                    >
                      Close Issue
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="issue-description">
            <h5>Description</h5>
            <div className="description-content">
              {issue.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="card">
        <div className="card-header">
          <h4>Comments ({comments.length})</h4>
        </div>
        <div className="card-body">
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="empty-comments">
                <p className="text-muted">No comments yet</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.user_username}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Comment form */}
          <div className="comment-form mt-4">
            <h5>Add a Comment</h5>
            <form onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={handleCommentChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingComment}
              >
                {submittingComment ? 'Submitting...' : 'Submit Comment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
