// auth.jsx
import { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');

  const login = (userData) => {
    // Call API to authenticate user
    // For now, just set the user data
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, currentPage, handlePageChange }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
