// Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    roleId: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateFormData(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      register(formData);
      navigate('/login');
    }
  };

  const validateFormData = (formData) => {
    const errors = {};
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    if (!formData.roleId) {
      errors.roleId = 'Role ID is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  return (
    <div className="Register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="First-Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div>{errors.firstName}</div>}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="Last-Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div>{errors.lastName}</div>}
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="Register-input"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div>{errors.email}</div>}
        <br />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="Register-input"
        >
          <option value="">Select Role</option>
          <option value="academic_registrar">Academic Registrar</option>
          <option value="lecturer">Lecturer</option>
        </select>
        {errors.role && <div>{errors.role}</div>}
        <br />
        <input
          type="text"
          name="roleId"
          placeholder="Enter Role ID"
          className="Register-input"
          value={formData.roleId}
          onChange={handleChange}
        />
        {errors.roleId && <div>{errors.roleId}</div>}
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="Register-input"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div>{errors.password}</div>}
        <br />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="Register-input"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <div>{errors.confirmPassword}</div>}
        <br />
        <button type="submit" className="Submit-Button">Submit</button>
        <br />
      </form>
    </div>
  );
};

export default Register;
