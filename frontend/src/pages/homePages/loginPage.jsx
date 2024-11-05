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
    <div className="flex justify-center items-center min-h-screen bg-stone-200">
    <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-2xl">
        {/* Image Container */}
        <div className="hidden md:flex md:w-1/2">
          <img
            src="/images/login.jpg" // Replace with your image URL
            alt="Login"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>  
        
        {/* Login Form Container */}
        <div className="w-full md:w-1/2 p-8 pt-24 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">Log In</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">Email Address</label>
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
              <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
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
              <Link to="/forgot-password" className="text-base text-indigo-600 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition duration-200">Log In</button>
          </form>
          <div className="text-center">
            <p className="text-base text-gray-600">Don’t have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
