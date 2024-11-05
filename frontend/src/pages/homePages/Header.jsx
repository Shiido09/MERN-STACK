import React from 'react';
import { Link } from 'react-router-dom';
import { handleLogout } from '../../components/authUtils'; // Adjust the import path as needed

const Header = ({ isAuthenticated, user, setIsAuthenticated, setUser, setIsAdmin }) => {
  const logout = async () => {
    console.log("Logout button clicked in Header");
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
    console.log("Logout function executed in Header");
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-16"> {/* Fixed height for consistent alignment */}
          <div className="text-2xl font-bold text-gray-800">HAB APPLIANCES</div>
          <nav className="space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-black">Products</Link>
            <Link to="/brand" className="text-gray-600 hover:text-black">Brand</Link>
            <Link to="/vlogs" className="text-gray-600 hover:text-black">Vlogs</Link>
            {isAuthenticated ? (
              <>
                <Link to="/Carts" className="text-gray-600 hover:text-black">Cart</Link>
                <Link to="/Orders" className="text-gray-600 hover:text-black">Orders</Link>
                <Link to="/account" className="text-gray-600 hover:text-black">Account</Link>
                <button onClick={logout} className="text-gray-600 hover:text-black">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-black">Log In</Link>
                <Link to="/signup" className="text-gray-600 hover:text-black">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
