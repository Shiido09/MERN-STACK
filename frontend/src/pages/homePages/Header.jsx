import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthStatus, handleLogout } from '../../components/authUtils'; // Adjust the import path as needed
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserAlt, FaUserPlus } from 'react-icons/fa'; // Import icons from react-icons
import { toast } from 'react-toastify'; // Import toast from react-toastify

const Header = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    const storedAuth = checkAuthStatus();
    setIsAuthenticatedState(storedAuth);
  }, []);

  const logout = async () => {
    console.log("Logout button clicked in Header");
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
    setIsAuthenticatedState(false);
    navigate('/login'); // Redirect to login page
    toast.success('Logged out successfully');
    console.log("Logout function executed in Header");
  };

  return (
    <header className="w-full bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-16"> {/* Fixed height for consistent alignment */}
          <div className="text-2xl font-bold text-white">HAB APPLIANCES</div>
          <nav className="space-x-6">
            <Link to="/index" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
            <Link to="/checkout" className="text-white hover:text-gray-300">Checkout</Link> {/* nilagay q kase hindi q maview */}
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-white hover:text-gray-300">
                  <FaShoppingCart className="inline-block text-xl" /> {/* Cart icon */}
                </Link>
                <Link to="/orders" className="text-white hover:text-gray-300">Orders</Link>
                <Link to="/profile" className="text-white hover:text-gray-300">
                  <FaUserAlt className="inline-block text-xl" /> {/* Account icon */}
                </Link>
                <button onClick={logout} className="text-white hover:text-gray-300">
                  <FaSignOutAlt className="inline-block text-xl" /> {/* Logout icon */}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-300">
                  <FaSignInAlt className="inline-block text-xl" /> {/* Login icon */}
                </Link>
                <Link to="/signup" className="text-white hover:text-gray-300">
                  <FaUserPlus className="inline-block text-xl" /> {/* Signup icon */}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
