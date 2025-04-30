import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, user needs to login again
          return Promise.reject(error);
        }
        
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });
        
        // Store the new token
        localStorage.setItem('access_token', response.data.access);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, user needs to login again
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  login: (credentials) => API.post('token/', credentials),
  register: (userData) => API.post('register/', userData),
  getCurrentUser: () => API.get('current-user/'),
};

// Issue service
export const issueService = {
  getIssues: () => API.get('issues/'),
  getIssue: (id) => API.get(`issues/${id}/`),
  createIssue: (issueData) => API.post('issues/', issueData),
  updateIssue: (id, issueData) => API.put(`issues/${id}/`, issueData),
  resolveIssue: (id) => API.post(`issues/${id}/resolve/`),
};

// Comment service
export const commentService = {
  getComments: (issueId) => API.get(`comments/?issue=${issueId}`),
  createComment: (commentData) => API.post('comments/', commentData),
};

// Notification service
export const notificationService = {
  getNotifications: () => API.get('notifications/'),
  markAsRead: (id) => API.post(`notifications/${id}/mark_as_read/`),
  markAllAsRead: () => API.post('notifications/mark_all_as_read/'),
};

// System service
export const systemService = {
  getSystemInfo: () => API.get('system-info/'),
  getFacultyMembers: () => API.get('faculty-members/'),
};

export default API;
