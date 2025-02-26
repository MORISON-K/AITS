import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth.js';

const Login = ({ handlePageChange }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState('student');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return alert("Please enter both email and password.");
    }
    login({ ...formData, role });
    navigate('/student-dashboard');
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" className="login-input" value={formData.email} onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" className="login-input" value={formData.password} onChange={handleChange} /><br />
        <select name="role" value={role} onChange={handleRoleChange}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="registrar">Registrar</option>
        </select><br />
        <span className="Forgot-Password">Forgot Password?</span><br />
        <button type="submit" className="login">Login</button><br />
        <span className="without">Don't have an account? </span>
        <span className="without-account" onClick={() => handlePageChange("register")}>Sign up</span>
      </form>
    </div>
  );
};

export default Login;
