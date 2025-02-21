import React from 'react';

const Login = ({ handlePageChange }) => {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        <label>Email:</label>
        <input type="email" />
        <br />
        <label>Password:</label>
        <input type="password" />
        <br />
        <button type="submit">Login</button>
      </form>
      <button className="back-button" onClick={() => handlePageChange('welcome')}>
        Back to Home
      </button>
    </div>
  );
};

export default Login;
