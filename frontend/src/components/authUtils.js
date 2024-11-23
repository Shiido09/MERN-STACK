// src/utils/authUtils.js
import axios from 'axios';

export const checkAuthStatus = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const handleLogout = async (setIsAuthenticated, setUser, setIsAdmin) => {
  try {
    // Get the FCM token from localStorage
    const fcmToken = localStorage.getItem('fcmToken');
    if (fcmToken) {
      // Delete the FCM token from the server
      await axios.post('http://localhost:5000/api/auth/delete-fcm-token', { fcmToken }, { withCredentials: true });
      // Delete the FCM token from the client
      await deleteToken(messaging);
      localStorage.removeItem('fcmToken');
    }

    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  } catch (error) {
    console.error('Logout error:', error);
  }
};