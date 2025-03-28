import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState('student');
  const { login, currentPage, handlePageChange } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    
    if (!formData.email) {
      validationErrors.email = "Please enter your email.";
    }
    if (!formData.password) {
      validationErrors.password = "Please enter your password.";
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    login({ ...formData, role });
    
    // if (role === 'student') {
    //   navigate('/student-dashboard');
    // } else if (role === 'lecturer') {
    //   navigate('/lecturer-dashboard');
    // } else if (role === 'registrar') {
    //   navigate('/registrar-dashboard');
    // }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="login-input" 
          value={formData.email} 
          onChange={handleChange} 
        /><br />
        {errors.email && <div className="error-message" style={{ color: 'red' }}>{errors.email}</div>}
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="login-input" 
          value={formData.password} 
          onChange={handleChange} 
        /><br />
        {errors.password && <div className="error-message" style={{ color: 'red' }}>{errors.password}</div>}
        
        {/* <select name="role" value={role} onChange={handleRoleChange}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="registrar">Registrar</option>
        </select><br /> */}
        
        <span className="Forgot-Password">Forgot Password?</span><br />
        <button type="submit" className="login">Login</button><br />
        <span className="without">Don't have an account? </span>
        <span className="without-account" onClick={() => handlePageChange("register")}>Sign up</span>
      </form>
    </div>
  );
};

export default Login;
