import React from 'react';

const Register = ({ handlePageChange }) => {
  return (
    <div className="Register-page">
      <h1>Register</h1>
      <form>
        <input type="text" placeholder='First Name' className='First-Name' />
        <input type="text" placeholder='Last Name' className='Last-Name' />
        <br />
        <input type="email" placeholder='Email' className='Register-input' />
        <br />
        <input type="text" placeholder='Select Role' className='Register-input' /><br />
        <input type="text" placeholder='Enter Role ID' className='Register-input' /><br />
        <input type="password" placeholder='Password' className='Register-input' />
        <br />
        <input type="password" placeholder='Confirm Password' className='Register-input' /><br />
        <button className='Submit-Button'>Submit</button><br />
      </form>
      {/* <button className="back-button" onClick={() => handlePageChange('welcome')}>
        Back to Home
      </button> */}
    </div>

  );
};

export default Register;
