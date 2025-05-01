import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { isAuthenticated, logout } from '../services/auth';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    if (isAuthenticated()) {
      try {
        // Get current user information
        const response = await authService.getCurrentUser();
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // If there's an error, user is not authenticated
        console.error('Failed to get user data:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Update authentication state
    await checkAuth();
    
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
