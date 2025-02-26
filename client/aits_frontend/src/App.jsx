import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth';
import Login from './Login';
import Register from './Register';
import './App.css';
import IssueSubmission_form from './IssueSubmission_form';
import StudentDashboard from './StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthContext.Consumer>
          {({ currentPage, handlePageChange }) => (
            <div className="app-container">
              <nav className="nav-bar">
                <button className="nav-button" onClick={() => handlePageChange('welcome')}> Home </button>
              </nav>
              <Routes>
                <Route path="/" element={
                  currentPage === 'welcome' ? (
                    <div className="welcome-page">
                      <img src="/muk_logo.jpeg" alt="Logo not found" />
                      <h1>Welcome to Academic Issue Tracking System</h1>
                      <div className="button-container">
                        <button className="register-button" onClick={() => handlePageChange('register')}> Register </button>
                        <button className="login-button" onClick={() => handlePageChange('login')}> Login </button>
                      </div>
                    </div>
                  ) : currentPage === 'login' ? (
                    <Login handlePageChange={handlePageChange} />
                  ) : currentPage === 'register' ? (
                    <Register handlePageChange={handlePageChange} />
                  ) : currentPage === 'issueSubmission' ? (
                    <IssueSubmission_form />
                  ) : null
                } />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
              </Routes>
            </div>
          )}
        </AuthContext.Consumer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
