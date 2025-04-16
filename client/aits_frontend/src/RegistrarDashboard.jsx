import React from 'react';
import './App.css';
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from './auth';


// Sidebar Component
const Sidebar = ({ handleLogout, user }) => {
  return (
    <section id="sidebar">
      <div className="brand">
        <i className="bx bxs-smile"></i>
        <span className="text">
  {user ? (
    <div className="user-info">
      <div className="user-name">
        <strong>Name:</strong> {user.name || user.username || user.fullName || user.full_name || user.email || 'Unknown'}
      </div>
      {(user.role_id || user.roleId) && (
        <div className="role-id">
          <strong>Role:</strong> {user.role_id || user.roleId}
        </div>
      )}
    </div>
  ) : (
    'Profile'
  )}
</span>
      </div>
      
      <ul className="side-menu top p-4">
        <li className="active">
          <Link to="/registrar-dashboard" className="flex items-center p-3 text-white hover:bg-gray-700">
            <i className="bx bxs-dashboard text-xl mr-3"></i>
            <span className="text-lg">Dashboard</span>
          </Link>
          
        </li>
        <li className="active" >
          <Link to="/manage-issues" className="flex items-center p-3 text-white hover:bg-gray-700">
            <i className="bx bxs-folder-open text-xl mr-3"></i>
            <span className="text-lg">Manage Student Issues.</span>
          </Link>
        </li>
        
      
        
      </ul>
      <ul className="side-menu p-4">
        <li>
        <a href="#!" onClick={handleLogout} className="logout">
            <i className="bx bxs-log-out-circle"></i>
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
};



// Content Component
const Content = () => {
  return (
    <section id="content" className="bg-gray-50 p-6 rounded-lg flex-1">
      <main>
        {/* Header Section */}
        <div className="head-title flex justify-between items-center mb-6">
          <div className="left">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Registrar!</h1>
            <ul className="breadcrumb text-sm text-gray-600">
              <li>
                <Link to="/registrar-dashboard">Dashboard</Link>
              </li>
              <li>
                <i className="bx bx-chevron-right text-gray-500"></i>
              </li>
            </ul>
          </div>
          {/* User Avatar */}
          <div className="right">
            <i className="bx bxs-user-circle text-4xl text-gray-600"></i>
          </div>
        </div>

        {/* Recent Updates Section */}
        <div className="recent-updates mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Updates</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-600">No recent updates yet. Keep track of Student Issues!</p>
          </div>
        </div>
      </main>
    </section>
  );
};


// Main RegistrarDashboard Component
const  RegistrarDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/Login-Page');
  };

  return (
    <div className="admin-hub">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Content />
    </div>
  );
};

export default RegistrarDashboard;
