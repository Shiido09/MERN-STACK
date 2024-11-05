import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
      }, { withCredentials: true });

      if (response.status === 200) {
          const user = response.data.user;
          onLogin(user);
          if (user.isAdmin) {
              navigate('/admin/dashboard');
          } else {
              navigate('/products');
          }
      }
  } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
      } else {
          setError('Login failed. Please try again.');
      }
      setTimeout(() => setError(''), 2000);
  }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-400">
        <div className="w-96 h-auto p-8 space-y-6 bg-white shadow-lg rounded-lg transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-800">Log In</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">Log In</button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">Don’t have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
