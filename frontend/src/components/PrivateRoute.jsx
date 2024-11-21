import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, isAdmin = false }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ message: 'Cannot access this page!' }} />;
  }

  if(isAdmin == true )

  return element;
};

export default PrivateRoute;