import React from 'react';

const Register = () => {
  return (
    <div>
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
    </div>
  );
};

export default Register;
