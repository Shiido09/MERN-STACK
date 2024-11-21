import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element, isAuthenticated, isAdmin }) => {
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ message: 'Cannot access this you are not an admin!' }} />;
  }

  return element;
};

export default AdminRoute;