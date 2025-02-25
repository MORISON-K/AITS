import React from 'react';

const Login = ({ handlePageChange }) => {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder= "Email" className='login-input'/><br />
        <input type="password" placeholder='Password' className='login-input'/>
        <br />
        <span className='Forgot-Password'>Forgot Password?</span><br />
        <button type="submit" className='login'>Login</button><br />
        <span className='without'>Don't have an account? </span>
        <span className='without-account'>Sign up</span>
      </form>
      {/* <button className="back-button" onClick={() => handlePageChange('welcome')}>
        Back to Home
      </button> */}
    
    </div>
  );
};

export default Login;
