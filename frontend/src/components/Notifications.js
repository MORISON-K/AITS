import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, refreshNotifications } = useContext(NotificationContext);

  useEffect(() => {
    // Refresh notifications when component mounts
    refreshNotifications();
  }, [refreshNotifications]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Extract the issue ID from notification
  const extractIssueId = (notification) => {
    return notification.issue;
  };

  return (
    <div className="notifications-container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Notifications</h3>
          {notifications.length > 0 && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </button>
          )}
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">You have no notifications</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="notification-actions">
                    <Link 
                      to={`/issues/${extractIssueId(notification)}`} 
                      className="btn btn-sm btn-outline-primary mr-2"
                    >
                      View Issue
                    </Link>
                    {!notification.is_read && (
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
