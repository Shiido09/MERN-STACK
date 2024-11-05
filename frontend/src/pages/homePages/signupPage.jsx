import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
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
          src="/images/signup.jpg" // Replace with your signup image URL
          alt="Sign Up"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>
      
      {/* Signup Form Container */}
      <div className="w-full md:w-1/2 p-8 pt-16 space-y-6"> {/* Added padding and spacing */}
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-base font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>
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
          <button type="submit" className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition duration-200">Sign Up</button>
        </form>
        <div className="text-center">
          <p className="text-base text-gray-600">Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default SignupPage;
