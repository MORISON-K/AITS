import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueService, systemService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const IssueForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  
  useEffect(() => {
    // Load system info for categories and priorities
    fetchSystemInfo();
    
    // If editing, load issue data
    if (isEditing && id) {
      fetchIssue(id);
    }
  }, [isEditing, id]);
  
  const fetchSystemInfo = async () => {
    try {
      const response = await systemService.getSystemInfo();
      setCategories(response.data.categories);
      setPriorities(response.data.priorities);
      
      // Set default category if none selected
      if (!formData.category && response.data.categories.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: response.data.categories[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
      setError('Failed to load form options. Please try again later.');
    }
  };
  
  const fetchIssue = async (issueId) => {
    setLoading(true);
    try {
      const response = await issueService.getIssue(issueId);
      
      // Populate form with issue data
      setFormData({
        title: response.data.title,
        description: response.data.description,
        category: response.data.category,
        priority: response.data.priority
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching issue:', error);
      setError('Failed to load issue data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditing && id) {
        // Update existing issue
        await issueService.updateIssue(id, formData);
        navigate(`/issues/${id}`);
      } else {
        // Create new issue
        const response = await issueService.createIssue(formData);
        navigate(`/issues/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object') {
          // Format validation errors
          const errorMessages = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(error.response.data);
        }
      } else {
        setError('Failed to submit the issue. Please try again later.');
      }
      setSubmitting(false);
    }
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
  
  return (
    <div className="issue-form-container">
      <div className="card">
        <div className="card-header">
          <h3>{isEditing ? 'Edit Issue' : 'Report New Issue'}</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief title describing the issue"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Provide detailed information about the issue"
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="category">Category *</label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group col-md-6">
                <label htmlFor="priority">Priority *</label>
                <select
                  className="form-control"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  {priorities.map((priority, index) => (
                    <option key={index} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  isEditing ? 'Update Issue' : 'Submit Issue'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;
