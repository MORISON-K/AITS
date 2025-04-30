import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get role badge styling
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'student':
        return 'badge-info';
      case 'faculty':
        return 'badge-success';
      case 'admin':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Academic Issue Tracker
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarMain">
            {isAuthenticated ? (
              <>
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  
                  {currentUser && currentUser.role === 'student' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/issues/new">
                        Report Issue
                      </Link>
                    </li>
                  )}
                </ul>
                
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link notification-link" to="/notifications">
                      <i className="fa fa-bell"></i> Notifications
                      {unreadCount > 0 && (
                        <span className="badge badge-danger notification-badge">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {currentUser && (
                        <>
                          {currentUser.first_name} {currentUser.last_name}
                          {currentUser.role && (
                            <span className={`badge ml-2 ${getRoleBadgeClass(currentUser.role)}`}>
                              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                            </span>
                          )}
                        </>
                      )}
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                      <Link className="dropdown-item" to="/dashboard">
                        Dashboard
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
