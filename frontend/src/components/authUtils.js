// authUtils.js
import axios from 'axios';

export const handleLogout = async (setIsAuthenticated, setUser, setIsAdmin) => {
  try {
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
