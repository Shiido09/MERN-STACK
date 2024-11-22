import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, isAdmin, adminOnly }) => {
  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace state={{ message: 'Please log in to access this page.' }} />;
  }

  if (adminOnly && !isAdmin) {
    
    return <Navigate to="/login" replace state={{ message: 'You are not authorized to access this page.' }} />;
  }

  return element;
};

export default PrivateRoute;
