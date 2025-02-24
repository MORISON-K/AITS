import React from 'react';

const Register = ({ handlePageChange }) => {
  return (
    <div className="register-page">
      <h1>Register</h1>
      <form>
        <input type="text" placeholder='First Name' />
        <input type="text" placeholder='Second Name' />
        <br />
        <input type="email" placeholder='Email'/>
        <br />
        <input type="text" placeholder='Select Role'/><br />
        <input type="text" placeholder='Enter Role ID' /><br />
        <input type="password" placeholder='Password'/>
        <br />
        <input type="text" placeholder='Confirm Password' /><br />
        <button>Submit</button><br />
        {/* <button type="submit">Register</button> */}
      </form>
      {/* <button className="back-button" onClick={() => handlePageChange('welcome')}>
        Back to Home
      </button> */}
    </div>

  );
};

export default Register;
