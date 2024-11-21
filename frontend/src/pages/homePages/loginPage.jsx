// src/pages/homePages/loginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';
import axios from 'axios';
import Header from './Header';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message, { toastId: 'protected-route-error' });
      navigate(location.pathname, { replace: true, state: {} }); // Clear state
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true }
      );

      if (response.status === 200) {
        const user = response.data.user;
        onLogin(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', user.isAdmin.toString());
        if (user.isAdmin) {
          navigate('/admin/dashboard');
          toast.success('Login successfully!');
        } else {
          navigate('/products');
          toast.success('Login successfully!');
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post(
        'http://localhost:5000/api/auth/google-login',
        { idToken },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const user = response.data.user;
        onLogin(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', user.isAdmin.toString());
        if (user.isAdmin) {
          navigate('/admin/dashboard');
          toast.success('Login successfully!');
        } else {
          navigate('/products');
          toast.success('Login successfully!');
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-stone-200">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-2xl">
          <div className="hidden md:flex md:w-1/2">
            <img src="/images/signup.jpg" alt="Sign Up" className="object-cover w-full h-full rounded-l-lg" />
          </div>
          <div className="w-full md:w-1/2 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
            {error && <p className="text-red-600 text-center">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                  Email Address
                </label>
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
                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                  Password
                </label>
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
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="inherit" />
                  </Box>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4"
            >
              Sign in with Google
            </button>
            <div className="text-center">
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800">
                Forgot Password?
              </Link>
            </div>
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;