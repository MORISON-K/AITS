import { createContext, useState, useEffect, useContext } from 'react';
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

export const AuthContext = createContext();

export const useAuth = () =>  useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [loadingUser, setLoadingUser] = useState(true);

  //  function to load user from token
  const loadUserFromStorage = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const response = await api.get('/api/auth/user/');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to load user details:', error);
        logout();
      }
    }
    setLoadingUser(false);
  };

  
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login/', credentials);
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      
      // Immediately fetching user details after login
      const userResponse = await api.get('/api/auth/user/');
      setUser(userResponse.data);
      
      return userResponse.data; // Return user data for immediate use
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    
    try {
      if (refreshToken) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/logout/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      setUser(null);
      window.location.href = '/Login-Page'; // Force full reload
    }
  };

  
  if (loadingUser) {
    return <div>Loading authentication state...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      currentPage,
      handlePageChange,
      login,
      logout,
      loadUserFromStorage // Expose for ProtectedRoute
    }}>
      {children}
    </AuthContext.Provider>
  );
};