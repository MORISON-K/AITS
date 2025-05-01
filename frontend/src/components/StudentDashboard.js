import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  
  // States for filtering and sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    fetchIssues();
  }, []);
  
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await issueService.getIssues();
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to load your issues. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter and sort the issues
  const filteredAndSortedIssues = () => {
    let filtered = [...issues];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      // Handle date sorting
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      // Compare values based on sort direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filtered;
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
  
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h3>My Reported Issues</h3>
        <Link to="/issues/new" className="btn btn-primary">
          <i className="fa fa-plus"></i> Report New Issue
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="filters-container">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="status-filter">Filter by Status</label>
              <select
                id="status-filter"
                className="form-control"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="sort-by">Sort By</label>
              <select
                id="sort-by"
                className="form-control"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="created_at">Date Created</option>
                <option value="updated_at">Date Updated</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="sort-direction">Sort Direction</label>
              <select
                id="sort-direction"
                className="form-control"
                value={sortDirection}
                onChange={e => setSortDirection(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {filteredAndSortedIssues().length === 0 ? (
            <div className="empty-state">
              <div className="alert alert-info">
                <h4>No Issues Found</h4>
                <p>You haven't reported any issues yet or no issues match your current filters.</p>
                <Link to="/issues/new" className="btn btn-primary mt-2">
                  Report Your First Issue
                </Link>
              </div>
            </div>
          ) : (
            <div className="issues-container">
              <div className="table-responsive">
                <table className="table table-hover issue-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedIssues().map(issue => (
                      <tr key={issue.id}>
                        <td className="issue-title">{issue.title}</td>
                        <td>{issue.category}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                            {issue.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${issue.priority === 'high' || issue.priority === 'urgent' ? 'badge-danger' : 'badge-info'}`}>
                            {issue.priority.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                        <td>{new Date(issue.updated_at).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/issues/${issue.id}`} className="btn btn-sm btn-outline-primary mr-1">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="dashboard-stats">
        <div className="row">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Total Issues</div>
              <div className="stat-value">{issues.length}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Open Issues</div>
              <div className="stat-value">
                {issues.filter(issue => ['new', 'assigned', 'in_progress'].includes(issue.status)).length}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Resolved</div>
              <div className="stat-value">
                {issues.filter(issue => issue.status === 'resolved').length}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Closed</div>
              <div className="stat-value">
                {issues.filter(issue => issue.status === 'closed').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
