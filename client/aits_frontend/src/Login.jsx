import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" }); 
  const [errors, setErrors] = useState({ username: "", password: "", nonField: "" });
  const { login, handlePageChange } = useContext(AuthContext);
  const navigate = useNavigate();

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
      const userData = await login({
        username: formData.username, 
        password: formData.password
      });

      switch(userData.role.toLowerCase()) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'lecturer':
          navigate('/lecturer-dashboard');
          break;
        case 'academic registrar':
          navigate('/registrar-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error(error);
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
        
        <span className="Forgot-Password">Forgot Password?</span><br />
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