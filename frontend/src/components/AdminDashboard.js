import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueService, systemService } from '../services/api';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyMembers, setFacultyMembers] = useState([]);
  
  // States for filtering and sorting
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    fetchIssues();
    fetchFacultyMembers();
  }, []);
  
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await issueService.getIssues();
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to load issues. Please try again later.');
    } finally {
      setLoading(false);
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
  
  // Filter and sort the issues
  const filteredAndSortedIssues = () => {
    let filtered = [...issues];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
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
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(issues.map(issue => issue.category))];
  
  // Assign issue to faculty member
  const assignIssue = async (issueId, facultyId) => {
    try {
      await issueService.updateIssue(issueId, {
        assigned_to: facultyId,
        status: 'assigned'
      });
      
      // Refresh issues
      fetchIssues();
    } catch (error) {
      console.error('Error assigning issue:', error);
      alert('Failed to assign issue. Please try again.');
    }
  };
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h3>All Issues</h3>
        <div className="action-buttons">
          <button 
            className="btn btn-outline-primary mr-2"
            onClick={fetchIssues}
          >
            <i className="fa fa-refresh"></i> Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="filters-container">
        <div className="row">
          <div className="col-md-3">
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
          
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="category-filter">Filter by Category</label>
              <select
                id="category-filter"
                className="form-control"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-md-3">
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
                <option value="status">Status</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-3">
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
                <p>No issues match your current filters.</p>
              </div>
            </div>
          ) : (
            <div className="issues-container">
              <div className="table-responsive">
                <table className="table table-hover issue-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Reported By</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedIssues().map(issue => (
                      <tr key={issue.id}>
                        <td className="issue-title">{issue.title}</td>
                        <td>{issue.created_by_username}</td>
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
                        <td>
                          {issue.assigned_to ? (
                            issue.assigned_to_username
                          ) : (
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                type="button" 
                                id={`assign-dropdown-${issue.id}`} 
                                data-toggle="dropdown" 
                                aria-haspopup="true" 
                                aria-expanded="false"
                              >
                                Assign
                              </button>
                              <div className="dropdown-menu" aria-labelledby={`assign-dropdown-${issue.id}`}>
                                {facultyMembers.map(faculty => (
                                  <button 
                                    key={faculty.id} 
                                    className="dropdown-item"
                                    onClick={() => assignIssue(issue.id, faculty.id)}
                                  >
                                    {faculty.first_name} {faculty.last_name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          <Link to={`/issues/${issue.id}`} className="btn btn-sm btn-outline-primary">
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
              <div className="stat-title">New Issues</div>
              <div className="stat-value">
                {issues.filter(issue => issue.status === 'new').length}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Assigned Issues</div>
              <div className="stat-value">
                {issues.filter(issue => issue.status === 'assigned').length}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-title">Resolved Issues</div>
              <div className="stat-value">
                {issues.filter(issue => issue.status === 'resolved').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
