import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Header from './Header';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (response.status === 200) {
        setSuccess('A password reset link has been sent to your email!');
        setError('');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send reset link. Please try again.');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-96 h-auto p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
          {error ? <p className="text-red-600 text-center">{error}</p> : success ? <p className="text-green-600 text-center">{success}</p> : <p className="text-center text-gray-600">Enter your email address, and we’ll send you a link to reset your password.</p>}
          <form className="space-y-4" onSubmit={handleForgotPassword}>
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
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
