import React from 'react';

const Register = ({ handlePageChange }) => {
  return (
    <div className="register-page">
      <h1>Register</h1>
      <form>
        <label>Name:</label>
        <input type="text" />
        <br />
        <label>Email:</label>
        <input type="email" />
        <br />
        <label>Password:</label>
        <input type="password" />
        <br />
        <button type="submit">Register</button>
      </form>
      <button className="back-button" onClick={() => handlePageChange('welcome')}>
        Back to Home
      </button>
    </div>
  );
};

export default Register;
