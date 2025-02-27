import React, { useState } from 'react';

const Register = ({ handlePageChange }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    roleId: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role || !formData.roleId || !formData.password || !formData.confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Form submitted:", formData);
  };

  return (
    <div className="Register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" className="First-Name" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" className="Last-Name" value={formData.lastName} onChange={handleChange} />
        <br />
        <input type="email" name="email" placeholder="Email" className="Register-input" value={formData.email} onChange={handleChange} />
        <br />
        <select name="role" value={formData.role} onChange={handleChange} className="Register-input">
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="academic_registrar">Academic Registrar</option>
          <option value="lecturer">Lecturer</option>
        </select>
        <br />
        <input type="text" name="roleId" placeholder="Enter Role ID" className="Register-input" value={formData.roleId} onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Password" className="Register-input" value={formData.password} onChange={handleChange} />
        <br />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" className="Register-input" value={formData.confirmPassword} onChange={handleChange} />
        <br />
        <button type="submit" className="Submit-Button">Submit</button>
        <br />
      </form>
    
    </div>
  );
};

export default Register;
