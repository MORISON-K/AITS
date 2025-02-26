import React from 'react';
import Login from './Login';
import Register from './Register';
import './App.css';
import IssueSubmission_form from './IssueSubmission_form';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import { AuthProvider } from './auth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <nav className="nav-bar">
            <button className="nav-button" onClick={() => window.location.href = '/'}> Home </button>
          </nav>
          <Routes>
            <Route path="/" element={
              <AuthContext.Consumer>
                {({ currentPage, handlePageChange }) => (
                  currentPage === 'welcome' ? (
                    <div className="welcome-page">
                      <img src="/muk_logo.jpeg" alt="Logo not found" />
                      <h1>Welcome to Academic Issue Tracking System</h1>
                      <div className="button-container">
                        <button className="register-button" onClick={() => handlePageChange('register')}> Register </button>
                        <button className="login-button" onClick={() => handlePageChange('login')}> Login </button>
                        {/* <button className='issue-button' onClick={() => handlePageChange('issueSubmission')}> Create New Issue </button> */}
                      </div>
                    </div>
                  ) : currentPage === 'login' ? (
                    <Login handlePageChange={handlePageChange} />
                  ) : currentPage === 'register' ? (
                    <Register handlePageChange={handlePageChange} />
                  ) : currentPage === 'issueSubmission' ? (
                    <IssueSubmission_form />
                  ) : null
                )}
              </AuthContext.Consumer>
            } />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
