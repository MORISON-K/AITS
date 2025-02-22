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
    <div className="app-container">
      <nav className="nav-bar">
        <button className="nav-button" onClick={() => handlePageChange('welcome')}>
          Home
        </button>
        {currentPage !== 'welcome' && (
          <button className="nav-button" onClick={() => handlePageChange('welcome')}>
            Back to Home
          </button>
 )}
 </nav>
 {currentPage === 'welcome' ? (
   <div className="welcome-page">
    <img src="/muk_logo.jpeg" alt="Logo not found" />
     <h1>Welcome to Academic Issue Tracking System</h1>
     <div className="button-container">
       <button
         className="register-button"
         onClick={() => handlePageChange('register')}
       >
         Register
       </button>
       <button className="login-button" onClick={() => handlePageChange('login')}>
         Login
       </button>
     </div>
   </div>
 ) : currentPage === 'login' ? (
   <Login handlePageChange={handlePageChange} />
 ) : (
   <Register handlePageChange={handlePageChange} />
 )}
</div>
);
}

export default App;
