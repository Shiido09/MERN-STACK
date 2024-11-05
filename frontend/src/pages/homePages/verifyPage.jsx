import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import the Header component

const VerifyPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook for navigation after verification

  const handleVerify = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Replace '/api/auth/verify-email' with your actual verification endpoint
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        code,
      });

      // Handle successful verification
      if (response.status === 200) {
        setSuccess('Your email has been verified successfully!'); // Set success message
        setError(''); // Clear error before showing success
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      }
    } catch (err) {
      // Check if the error response has a message from the backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display error message from backend
      } else {
        setError('Verification failed. Please try again.'); // Default error message
      }

      // Clear error message after 2 seconds
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div>
      <Header /> {/* Add Header component here */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-96 h-auto p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">Verify Your Account</h2>
          {/* Conditionally render messages */}
          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : success ? (
            <p className="text-green-600 text-center">{success}</p>
          ) : (
            <p className="text-center text-gray-600">
              Account created successfully! Check your email and enter the verification code below.
            </p>
          )}

          {/* Verification Form */}
          <form className="space-y-4" onSubmit={handleVerify}>
            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your verification code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
