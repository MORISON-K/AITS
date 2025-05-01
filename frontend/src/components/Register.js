import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { systemService } from '../services/api';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    department: '',
    student_id: ''
  });
  
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available roles from system info
    const fetchRoles = async () => {
      try {
        const response = await systemService.getSystemInfo();
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        // Set default roles if API fails
        setRoles([
          { value: 'student', label: 'Student' },
          { value: 'faculty', label: 'Faculty' },
          { value: 'admin', label: 'Administrator' }
        ]);
      }
    };
    
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authService.register(userData);
      setSuccess(true);
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response) {
        // Handle specific validation errors
        if (error.response.data) {
          if (typeof error.response.data === 'object') {
            // Concatenate all error messages
            const errorMessages = Object.entries(error.response.data)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
            setError(errorMessages);
          } else {
            setError(error.response.data);
          }
        } else {
          setError('Registration failed. Please check your information and try again.');
        }
      } else {
        setError('Unable to connect to server. Please check your internet connection.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Academic Issue Tracker</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={userData.first_name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="form-control"
            />
            <small className="form-text text-muted">Password must be at least 8 characters long</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={handleChange}
              required
              className="form-control"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={userData.department}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Computer Science, Mathematics"
            />
          </div>
          
          {userData.role === 'student' && (
            <div className="form-group">
              <label htmlFor="student_id">Student ID</label>
              <input
                type="text"
                id="student_id"
                name="student_id"
                value={userData.student_id}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading || success}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
