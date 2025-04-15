import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmEmail() {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>Enter Your Email and Receive a Confirmation Code</h1><br />
      <form>
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="email-input" 
          required 
        /> <br />
        <button type="submit">
          Send Confirmation Code
        </button>
      </form>
    </div>
  );
}

export default ConfirmEmail;