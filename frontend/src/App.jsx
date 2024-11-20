// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from './pages/homePages/loginPage';
import SignupPage from './pages/homePages/signupPage';
import VerifyPage from './pages/homePages/verifyPage';
import ForgotPasswordPage from './pages/homePages/forgotPasswordPage';
import ResetPasswordPage from './pages/homePages/resetPasswordPage';
import Dashboard from './pages/admin-pages/Dashboard';
import HomePage from './pages/homePages/home';
import PrivateRoute from './components/PrivateRoute';
import ProductList from './pages/admin-pages/ProductsList';
import IndexPage from './pages/homePages/index';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', userData.isAdmin.toString());
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setIsAdmin(storedAdmin);
    }
  }, []);

  return (
    <Router>
      <div className="bg-gray-50">
      <ToastContainer />
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/index" element={<IndexPage />} />
          {/* Admin Routes using PrivateRoute
          <Route path="/admin/dashboard" element={
            <PrivateRoute 
              element={<Dashboard />} 
              isAuthenticated={isAuthenticated} 
              isAdmin={isAdmin} 
            />
          } /> */}

          <Route path="/" element={<HomePage />} />
          
          {/* Add other routes with PrivateRoute if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
