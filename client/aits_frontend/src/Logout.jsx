
// Logout
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    logout();
    navigate('/login');  // Redirect to login page after logout
  }, [logout, navigate]);

  return null; 
};

export default Logout;