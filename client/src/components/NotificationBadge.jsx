import React, { useState, useEffect } from 'react';
import api from '../api';
import './NotificationBadge.css';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Try all possible endpoint formats for the unread count
      // This is necessary because the ViewSet might expose the action at different URLs
      const possibleEndpoints = [
        '/notifications/unread-count/',       // ViewSet action with hyphen (new url_path)
        '/notifications/unread_count/',       // ViewSet action with underscore (original name)
        '/notifications/unread-count/',       // Function-based view with hyphen
      ];
      
      let succeeded = false;
      
      for (const endpoint of possibleEndpoints) {
        if (succeeded) break;
        
        try {
          const response = await api.get(endpoint);
          setUnreadCount(response.data.count);
          console.log(`Successfully fetched unread count from ${endpoint}`);
          succeeded = true;
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}:`, error.message);
          // Continue to try next endpoint
        }
      }
      
      if (!succeeded) {
        console.error('Failed to fetch notification count from all endpoints');
        setUnreadCount(0); // Set to 0 if all endpoints fail
      }
    };

    // Fetch initially and then every 30 seconds
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown is opened
  const handleBadgeClick = async () => {
    if (!showDropdown) {
      // Try different possible endpoints like we did for unread count
      let succeeded = false;
      
      try {
        try {
          const response = await api.get('/notifications/');
          setNotifications(response.data);
          console.log('Successfully fetched notifications');
          succeeded = true;
        } catch (error) {
          console.log('Failed to fetch from /notifications/:', error.message);
          
          // Try alternative endpoint
          const fallbackResponse = await api.get('/user-notifications/');
          setNotifications(fallbackResponse.data);
          console.log('Successfully fetched notifications from fallback endpoint');
          succeeded = true;
        }
      } catch (error) {
        console.error('Failed to fetch notifications from all endpoints:', error);
        setNotifications([]); // Set to empty array if there's an error
      }
    }
    setShowDropdown(!showDropdown);
  };

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      try {
        // Try the main endpoint
        await api.post(`/notifications/mark-read/${notificationId}/`);
        console.log('Successfully marked notification as read');
      } catch (error) {
        console.log(`Failed primary endpoint for marking read:`, error.message);
        
        // Try the alternative endpoint
        await api.post(`/notifications/mark-notification-read/${notificationId}/`);
        console.log('Successfully marked notification as read with fallback endpoint');
      }
      
      // Update local state regardless of which endpoint succeeded
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true } 
          : notification
      ));
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read with all endpoints:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      try {
        // Try the main endpoint
        await api.post('/notifications/mark-all-read/');
        console.log('Successfully marked all notifications as read');
      } catch (error) {
        console.log('Failed primary endpoint for marking all as read:', error.message);
        
        // Try the alternative endpoint
        await api.post('/notifications/mark-all-notifications-read/');
        console.log('Successfully marked all notifications as read with fallback endpoint');
      }
      
      // Update local state regardless of which endpoint succeeded
      setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read with all endpoints:', error);
    }
  };

  return (
    <div className="notification-badge-container">
      <div className="notification-badge" onClick={handleBadgeClick}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;