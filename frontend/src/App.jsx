// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ProductPage from './pages/homePages/products';
import CartPage from './pages/homePages/cart';
import OrderPage from './pages/homePages/orders';
import ProfilePage from './pages/homePages/profile';
import CheckoutPage from './pages/homePages/checkout';
import { checkAuthStatus, handleLogout } from './components/authUtils';
import UserPage from './pages/admin-pages/UserPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthStatus());
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [loading, setLoading] = useState(true);

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
    const storedAuth = checkAuthStatus();
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
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} handleLogout={() => handleLogout(setIsAuthenticated, setUser, setIsAdmin)} />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true} />} />
          <Route path="/admin/products" element={<PrivateRoute element={<ProductList />} isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true} />} />
          <Route path="/admin/users" element={<PrivateRoute element={<UserPage />} isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true} />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<PrivateRoute element={<CartPage />} isAuthenticated={isAuthenticated} />} />
          <Route path="/orders" element={<PrivateRoute element={<OrderPage />} isAuthenticated={isAuthenticated} />} />
          <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} isAuthenticated={isAuthenticated} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;