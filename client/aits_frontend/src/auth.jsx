import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add some logging to understand what's happening
    console.log('AuthProvider mounted');
    console.log('Current Page:', currentPage);
    console.log('User:', user);
    
    // Simulate initial loading or checking of authentication state
    const checkAuthStatus = () => {
      // This could be where you check for stored tokens, etc.
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    console.log('Login called with:', userData);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const register = (userData) => {
    console.log('Register called with:', userData);
    setUser(userData);
    setCurrentPage('login');
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('welcome');
  };

  const handlePageChange = (page) => {
    console.log('Page change requested:', page);
    setCurrentPage(page);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        currentPage, 
        handlePageChange,
        isLoading 
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };