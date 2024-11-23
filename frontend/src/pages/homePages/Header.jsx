import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthStatus, handleLogout } from '../../components/authUtils'; // Adjust the import path as needed
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserAlt, FaUserPlus } from 'react-icons/fa'; // Import icons from react-icons
import { toast } from 'react-toastify'; // Import toast from react-toastify

const Header = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = checkAuthStatus();
    setIsAuthenticatedState(storedAuth);
  }, []);

  const confirmLogout = async () => {
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
    setIsAuthenticatedState(false);
    setShowLogoutModal(false); // Close the modal
    navigate('/login'); // Redirect to login page
    toast.success('Logged out successfully');
  };

  return (
    <header className="w-full bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-16">
          <div className="text-2xl font-bold text-white">HAB APPLIANCES</div>
          <nav className="space-x-6">
            <Link to="/index" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-white hover:text-gray-300">
                  <FaShoppingCart className="inline-block text-xl" />
                </Link>
                <Link to="/orders" className="text-white hover:text-gray-300">Orders</Link>
                <Link to="/profile" className="text-white hover:text-gray-300">
                  <FaUserAlt className="inline-block text-xl" />
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)} // Show modal on click
                  className="text-white hover:text-gray-300"
                >
                  <FaSignOutAlt className="inline-block text-xl" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-300">
                  <FaSignInAlt className="inline-block text-xl" />
                </Link>
                <Link to="/signup" className="text-white hover:text-gray-300">
                  <FaUserPlus className="inline-block text-xl" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)} // Close modal on cancel
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout} // Execute logout on confirm
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
