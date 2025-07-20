import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';
import { Link, Navigate } from 'react-router-dom';
const Login = ({ handlePageChange: propHandlePageChange }) => {
  const [formData, setFormData] = useState({ username: "", password: "" }); 
  const [errors, setErrors] = useState({ username: "", password: "", nonField: "" });
  const { login, handlePageChange: contextHandlePageChange } = useContext(AuthContext);
  const navigate = useNavigate();

  // Use the prop if provided, otherwise use the context
  const handlePageChange = propHandlePageChange || contextHandlePageChange;

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "", nonField: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!formData.username) { 
      validationErrors.username = "Please enter your username/email.";
    }
    if (!formData.password) {
      validationErrors.password = "Please enter your password.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      console.log('Attempting login with:', formData);
      console.log('API base URL:', import.meta.env.VITE_API_URL);
      const userData = await login({
        username: formData.username, 
        password: formData.password
      });
      
      console.log('Login successful, user data:', userData);

      // Check if role is available, default to admin dashboard if not
      if (!userData.role) {
        console.log('No role found in user data, defaulting to dashboard');
        navigate('/dashboard');
        return;
      }

      switch(userData.role.toLowerCase()) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'faculty':
          navigate('/lecturer-dashboard');
          break;
        case 'academic_registrar':
        case 'registrar':
        case 'admin':
          navigate('/registrar-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ ...errors, nonField: error.response?.data?.detail || "Invalid login credentials." });
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username/Email" 
          className="login-input" 
          value={formData.username} 
          onChange={handleChange} 
        /><br />
        {errors.username && <div className="error-message" style={{ color: 'red' }}>{errors.username}</div>}
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="login-input" 
          value={formData.password} 
          onChange={handleChange} 
        /><br />
        {errors.password && <div className="error-message" style={{ color: 'red' }}>{errors.password}</div>}
        {errors.nonField && <div className="error-message" style={{ color: 'red' }}>{errors.nonField}</div>}
        
        <Link to="/forgotPassword" className="Forgot-Password">Forgot Password?</Link><br />
        <button type="submit" className="login">Login</button><br />
        <span className="without">Don't have an account? </span>
        <span className="without-account" onClick={() => handlePageChange("register")}>
          Sign up
        </span>
      </form>
    </div>
  );
};

export default Login;