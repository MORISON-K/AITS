import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

// Create a context to share authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('welcome');

  // Function to handle page changes (required by App.jsx)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          // Set the token in the axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await api.get('/auth/user/');
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        
        // If token is invalid, try to refresh
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const refreshResponse = await api.post('/auth/refresh/', { 
              refresh: refreshToken 
            });
            
            // Update tokens
            localStorage.setItem(ACCESS_TOKEN, refreshResponse.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.access}`;
            
            // Fetch user data again
            const userResponse = await api.get('/auth/user/');
            setUser(userResponse.data);
            setIsAuthenticated(true);
          } catch (refreshErr) {
            // If refresh fails, user must log in again
            logout();
          }
        } else {
          // No refresh token, user must log in
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login/', credentials);
      console.log('Login response:', response.data);
      
      // Save tokens to localStorage
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      // Get user data
      console.log('Fetching user data with token...');
      const userResponse = await api.get('/auth/user/');
      console.log('User data response:', userResponse.data);
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      return userResponse.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register/', userData);
      
      // Auto login if API returns tokens upon registration
      if (response.data.access && response.data.refresh) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        const userResponse = await api.get('/auth/user/');
        setUser(userResponse.data);
        setIsAuthenticated(true);
      }
      
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // Remove tokens
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('welcome');
  };

  // Create auth value object
  const authValue = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    // Add the properties needed by App.jsx
    currentPage,
    handlePageChange
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};