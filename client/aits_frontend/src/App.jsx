import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="welcome-page">
      {currentPage === 'welcome' ? (
        <div>
          <h1>Welcome to Academic Issue Tracking System</h1>
          <div className="button-container">
            <button className="register-button" onClick={() => handlePageChange('register')}>
              Register
            </button>
            <button className="login-button" onClick={() => handlePageChange('login')}>
              Login
            </button>
            </div>
        </div>
      ) : currentPage === 'login' ? (
        <Login />
      ) : (
        <Register />
      )}
    </div>
  );
}

export default App;
