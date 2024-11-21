import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ message: 'Cannot access this page!' }} />;
  }

  return element;
};

export default PrivateRoute;