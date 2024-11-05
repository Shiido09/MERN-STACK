// src/pages/homePages/HomePage.jsx
import React from 'react';
import Header from './Header'; // Importing Header from the same folder

const HomePage = ({ isAuthenticated, user, handleLogout }) => {
  return (
    <div>
      <Header isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to HAB Appliances</h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
          Discover the latest and best appliances to make your home a better place. Explore our products, watch
          informative vlogs, and enjoy exclusive deals with us!
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Shop Now
        </button>
      </main>
    </div>
  );
};

export default HomePage;
