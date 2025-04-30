import React, { useState, useEffect } from "react";
import { useAuth } from "./auth";
import api from "./api";

const ConfirmEmail = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        
        if (!token) {
          setErrorMessage("Verification token is missing!");
          setIsVerifying(false);
          return;
        }
        
        const response = await api.post('/auth/verify-email/', { token });
        
        if (response.status === 200) {
          setVerificationSuccess(true);
          // If needed, automatically login the user after email verification
          // await login({ username: response.data.username, password: "..." });
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setErrorMessage(error.response?.data?.message || "Email verification failed. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [login]);

  return (
    <div className="email-verification-container">
      <h2>Email Verification</h2>
      
      {isVerifying && (
        <div className="verifying-message">
          <p>Verifying your email address...</p>
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {!isVerifying && verificationSuccess && (
        <div className="success-message">
          <h3>Email Verified Successfully!</h3>
          <p>Your email has been verified. You can now log in to your account.</p>
          <button onClick={() => window.location.href = '/Login-Page'}>
            Go to Login
          </button>
        </div>
      )}
      
      {!isVerifying && !verificationSuccess && (
        <div className="error-message">
          <h3>Verification Failed</h3>
          <p>{errorMessage}</p>
          <button onClick={() => window.location.href = '/'}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmEmail;