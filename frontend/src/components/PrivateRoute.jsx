// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, isAdmin }) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not an admin, show an error message or redirect
  if (!isAdmin) {
    return  <Navigate to="/login" replace /> // Optional: Replace with a redirect to a forbidden page if needed
  }

  // If authenticated and an admin, render the component
  return element;
};

export default PrivateRoute;
