import jwtDecode from 'jwt-decode';

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // If there's an error decoding, assume the token is invalid
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  return !isTokenExpired(token);
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Role should be included in the token payload
  } catch (error) {
    return null;
  }
};

// Log out user
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
